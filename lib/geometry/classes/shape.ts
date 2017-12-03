
import MAT_CONSTANTS from '../../mat-constants';

import Vector        from 'flo-vector2d';
import Memoize       from 'flo-memoize';
import Bezier3       from 'flo-bezier3';
import LlRbTree      from 'flo-ll-rb-tree';

import PathCurve     from '../../geometry/classes/path-curve';
import LinkedLoop    from '../../linked-list/linked-loop';
import ListNode      from '../../linked-list/list-node';
import BezierPiece   from '../../geometry/classes/bezier-piece';
import ContactPoint  from '../../mat/classes/contact-point';
import PointOnShape  from '../../geometry/classes/point-on-shape';
import Svg           from '../../svg/svg';
import MatCircle     from '../../mat/classes/mat-circle';
import Corner        from './corner';
import Circle        from './circle';
import HoleClosing2Prong from '../../mat/classes/hole-closing-2-prong';


let { m1: memoize } = Memoize;

import getContactCirclesAtBezierBezierInterface from '../functions/get-contact-circles-at-bezier-bezier-interface';
import getBezierOsculatingCircles from '../functions/get-bezier-osculating-circles';


class Shape {

	private shapeBoundingBox: number[][];
	private pointsOnShapePerLoop: LinkedLoop<PointOnShape>[];
	private bezierLoops: LinkedLoop<PathCurve>[];
	
	public for2ProngsArray: ListNode<PointOnShape>[][];	
	/** Hash of 2-prongs that need to be skipped in 2-prong procedure
	since we already have a hole-closing 2-prong there. */
	public skip2ProngHash: { [index:string]: PointOnShape } = {};
	/** Hash of PointOnShapes that has a normal pointing straight up. */
	public straightUpHash: { [index:string]: PointOnShape } = {};
	public extremes: {p: number[], bezierNode: ListNode<PathCurve>, t: number}[];

	/** A hash of all the dull corners (i.e. those with angle > 180 deg) */
	public dullCornerHash: { [index:string]: Corner } = {};
	public contactPointsPerLoop: LinkedLoop<ContactPoint>[];
	/** Hole closing 2-prongs that will be populated during find-mat */
	public holeClosers: HoleClosing2Prong[] = [];	
	
	/** 
	 * A Shape represents the loop of individual cubic bezier curves composing 
	 * an SVG element. When constructed, some initial analysis is done. 
	 * @param bezierArrays - An array (loop) of cubic bezier arrays. Each loop 
	 * represents a closed path of the shape.
	 */
	constructor(bezierArrays: PathCurve[][]) {
		// TODO - check if this will run in node (due to window object)
		if (typeof window !== 'undefined' && (<any>window)._debug_) { 
			(<any>window)._debug_.generated.timing.start = performance.now(); 
		}
		
		// The shape paths and sub-paths, a.k.a bezier loops.
		let bezierLoops = bezierArrays.map( 
			(array, k) => new LinkedLoop(array, undefined, k) 
		);
				
		// Orient the loops so that the outer loop is oriented positively - 
		// defined as anti-clockwise.  
		this.bezierLoops = orient(bezierLoops);
		
		this.extremes = this.bezierLoops.map(getExtremes);
		
		// This is to find the topmost points on each loop.
		this.extremes.sort(function(a,b) { return a.p[1] - b.p[1]; });
		this.bezierLoops.sort(function(a_,b_) {
			let a = getExtremes(a_);
			let b = getExtremes(b_);
			
			return a.p[1] - b.p[1];
		});
		// Re-index after ordering.
		for (let i=0; i<this.bezierLoops.length; i++) {
			this.bezierLoops[i].indx = i;
		}

		// Get metrics of the outer loop. ??
		this.shapeBoundingBox = getLoopBounds(bezierLoops[0]).shapeBoundingBox;
		
		// Gets interesting points on the shape, i.e. those that makes 
		// sense to use for the 2-prong procedure.
		let pointOnShapeArrPerLoop = Shape.getInterestingPointsOnShape(this);
		
		this.pointsOnShapePerLoop = pointOnShapeArrPerLoop.map(
				(array, i) => createCoupledLoops(array, i) 
		);

		
		// TODO Finish implementation. This is to space the points more
		// evenly. 
		//respacePoints(this.contactPointsPerLoop, 30);
		
		let { sharpCornersArray, for2ProngsArray } = 
			Shape.getPotential2Prongs(this);
		this.for2ProngsArray = for2ProngsArray;
		
		
		// Take account of sharp and dull corners for debugging and update 
		// straightUpHash.
		Shape.forEachPointOnShape(this, pos => {
			if (pos.type === MAT_CONSTANTS.pointType.sharp) {
				if (typeof window !== 'undefined' && (<any>window)._debug_) { 
					const _debug_ = (<any>window)._debug_;
					_debug_.generated.sharpCorners.push({pos});
				}
			} else {
				if (PointOnShape.isPointingStraightUp(pos)) {
					let key = PointOnShape.makeSimpleKey(pos.p);
					this.straightUpHash[key] = pos;	
				}
				
				if (typeof window !== 'undefined' && (<any>window)._debug_) { 
					if (pos.type === MAT_CONSTANTS.pointType.dull) {
						const _debug_ = (<any>window)._debug_;
						_debug_.generated.dullCorners.push({pos});
					}
				}
			}
		});
		
		
		this.contactPointsPerLoop = 
			createSharpCornerCpLoops(this, sharpCornersArray);
		
		if (typeof window !== 'undefined' && (<any>window)._debug_) { 
			const _debug_ = (<any>window)._debug_;
			_debug_.generated.timing.after1Prongs = performance.now(); 
		}
	}


	/**
	 * Applies f to each PointOnShape within the shape
	 * @param shape - The shape
	 * @param f - The function to call. 
	 */
	private static forEachPointOnShape(
			shape: Shape, 
			f: (pos: PointOnShape) => void) {
	
		let pointsOnShapePerLoop = shape.pointsOnShapePerLoop;

		for (let k=0; k<pointsOnShapePerLoop.length; k++) {
			let pointsOnShape =	pointsOnShapePerLoop[k];
			
			let posNode = pointsOnShape.head;
			do {
				let pos = posNode.item;
				f(pos);
				
				posNode = posNode.next;
			} while (posNode !== pointsOnShape.head);
		}
	}


	/**
	 * Get potential 2-prong points on shape.
	 * @param shape
	 */
	private static getPotential2Prongs(shape: Shape) {
		
		let pointsOnShapePerLoop = shape.pointsOnShapePerLoop;

		let sharpCornersArray = [];
		let for2ProngsArray = []; 
		
		for (let k=0; k<pointsOnShapePerLoop.length; k++) {
			let pointsOnShape =	pointsOnShapePerLoop[k];
			
			let sharpCorners = [];
			let for2Prongs = [];
			
			let posNode = pointsOnShape.head;
			do {
				let pos = posNode.item;
				
				if (pos.type === MAT_CONSTANTS.pointType.sharp) {
					sharpCorners.push(pos);
				} else {
					for2Prongs.push(posNode);
				} 
				
				posNode = posNode.next;
			} while (posNode !== pointsOnShape.head);
			
			
			sharpCornersArray.push(sharpCorners);
			for2ProngsArray.push(for2Prongs);
		}

		return { sharpCornersArray, for2ProngsArray };
	}


	/**
	 * Get useful points on the shape - these incude osculating points and points at 
	 * the bezier-bezier interfaces.  
	 * @param shape
	 */
	private static getInterestingPointsOnShape(shape: Shape) {
		let bezierLoops = shape.bezierLoops;
		let allPointsArray = [];
		
		for (let k=0; k<bezierLoops.length; k++) {
			let bezierLoop = bezierLoops[k];
			
			allPointsArray.push( 
					Shape.getInterestingPointsOnLoop(shape, bezierLoop)
			);
		}
			
		return allPointsArray;
	}


	/**
	 * TODO - uncomment and finish implementation
	 * Respace points so that the total absolute curvature between
	 * consecutive points are very roughly equal. 
	 * 
	 * @param contactPointsPerLoop
	 * @param maxAbsCurvatureInDegrees
	 * 
	 * NOTES: Mutates contactPoints.
	 */
	/*
	private static respacePoints(
			contactPointsPerLoop: LinkedLoop<ContactPoint>[], 
			maxAbsCurvatureInDegrees: number) {
		
		for (let k=0; k<contactPointsPerLoop.length; k++) {
			let contactPoints = contactPointsPerLoop[k];
			
			let cpNode = contactPoints.head;
			let recheck;
			do {
				recheck = false;
				
				let totalCurvatures = [];
				let denseCpNode = cpNode.coupledNode;
				
				do {
					let c = getTotalAbsCurvatureBetweenCps(
							[denseCpNode.item, denseCpNode.next.item]
					);
					
					totalCurvatures.push({cpNode: denseCpNode, c});
					
					denseCpNode = denseCpNode.next;
				} while (denseCpNode.coupledNode !== cpNode.next);

				let totalCurvature = sumCurvatures(totalCurvatures);
				
				cpNode.totalCurvatures = totalCurvatures;
				cpNode.totalCurvature  = totalCurvature;
				
				
				let totalInDegrees = totalCurvature * 180 / Math.PI;
				// if (totalInDegrees > 180 || totalInDegrees < 5) { console.log(totalInDegrees); }
				if (totalInDegrees > maxAbsCurvatureInDegrees) {
					// Add a point
					//console.log(totalCurvatures);
					
					let accumTot = 0;
					let tc = cpNode.totalCurvature; // cache
					let bestIndx = undefined;
					let leftDenseIndx = 0;
					let rightDenseIndx;
					let accumTotAtLeft  = 0;
					let accumTotAtRight = undefined;
					let bestDiff = Number.POSITIVE_INFINITY;
					for (let i=0; i<totalCurvatures.length; i++) {
						
						let c = totalCurvatures[i].c;
						let cTot = c.totalCurvature + c.totalTurn;
						accumTot += cTot;
						
						let cpn = totalCurvatures[i].cpNode;
						if (accumTot <= tc/2) {
							leftDenseIndx = i;
							accumTotAtLeft = accumTot;
						}

						if (!rightDenseIndx && accumTot > tc/2) {
							// This may be out of bounds but really means cpNode.next
							rightDenseIndx = i;
							accumTotAtRight = accumTot;
						}
					
						let absDiff = Math.abs(tc/2 - accumTot);
						// TODO - We can also add a weight for point values here
						// such that for instance inverse curvature points 
						// carry more weight than dull corners, etc.
						// TODO Make the 1/4 or 1/3 below a constant that can
						// be set.
						//if (accumTot > tc/3 && accumTot < 2*tc/3 &&
						if (accumTot > tc/4 && accumTot < 3*tc/4 &&
							bestDiff > absDiff) {
							// If within middle 1/3 and better
							
							bestIndx = i;
							bestDiff = absDiff; 
						}
					}

					
					// aaa console.log(leftDenseIndx, bestIndx, rightDenseIndx);
					
					if (bestIndx !== undefined) {
						// Reify the point
						let tcInfo = totalCurvatures[bestIndx];
						
						// Note that after the below insert cpNode.next will
						// equal the newly inserted cpNode.
						let newCpNode = LinkedLoop.insert(
								contactPoints, 
								tcInfo.cpNode.next.item, 
								cpNode,
								tcInfo.cpNode.next
						);
						tcInfo.cpNode.next.coupledNode = newCpNode;
						
						cpNode.totalCurvatures = cpNode.totalCurvatures.slice(
								0, bestIndx+1
						);
						cpNode.totalCurvature = sumCurvatures(
								cpNode.totalCurvatures
						);
						
						recheck = true; // Start again from same contact point.
					} else {
						// We could not find an 'interesting' point to use, so
						// find some center point between the two contact 
						// points.
						

						let leftTcInfo  = totalCurvatures[leftDenseIndx];
						let rightTcInfo = totalCurvatures[rightDenseIndx];
						
						let leftCpNode  = leftTcInfo. cpNode;
						let rightCpNode = rightTcInfo.cpNode;
						
						let leftC = leftTcInfo.c; 
						
						let leftCp = leftTcInfo.cpNode.next;
						let rightCp = rightTcInfo.cpNode.next;
						
						//aaa console.log(accumTotAtLeft,	accumTotAtRight, tc/2);
						
						
						let pos = getCPointBetweenCps(
								leftCpNode.item, rightCpNode.item,
								accumTotAtLeft,	accumTotAtRight,
								tc/2
						);

						
						/*
						let newCp = new ContactPoint(pos, undefined);
						let newCpNode = LinkedLoop.insert(
								contactPoints, 
								newCp, 
								leftCpNode,
								undefined
						);
						
						let newDenseCpNode = LinkedLoop.insert(
								denseContactPoints, 
								newCp, 
								cpNode,
								undefined
						);
						
						newCpNode.coupledNode = newDenseCpNode;
						newDenseCpNode.coupledNode = newCpNode;
						
						
						aaa
						cpNode.totalCurvatures = cpNode.totalCurvatures.slice(
								0, bestIndx
						);
						cpNode.totalCurvature = sumCurvatures(
								cpNode.totalCurvatures
						);
						
						recheck = true; // Start again from same contact point.
						*//*
					}
				} else if (totalInDegrees < 15) {
					// Remove a point
					//console.log(totalCurvatures);
					
				}
				

				if (!recheck) {
					cpNode = cpNode.next;
				}
			} while (cpNode !== contactPoints.head);
		}
	}*/


	/**
	 * 
	 */
	public static getBoundaryBeziers = function(
			shape: Shape, k: number) {

		let bezierLoop = shape.bezierLoops[k];
		let bezierPieces: BezierPiece[] = [];

		bezierLoop.forEach(function(bezierNode) {
			let bezierPiece = new BezierPiece(
					bezierNode, [0, 1]
			);
			
			bezierPieces.push(bezierPiece);
		});
		
		return bezierPieces;
	}


	/**
	 * TODO - uncomment and finish
	 * Get all points where shape intersect itself.
	 */
	/*
	function getSelfIntersections(shape: Shape) {
		//aaa
	}
	*/


	/**
	 * @param shape
	 * @param bezierLoop
	 */
	private static getInterestingPointsOnLoop(
			shape: Shape, bezierLoop: LinkedLoop<PathCurve>) {

		let dullCornerHash = shape.dullCornerHash;

		let points = [];
		let allPoints = [];

		let node = bezierLoop.head;
		do {
			//let bezier = node.item;

			let pointsOnShape1 = getContactCirclesAtBezierBezierInterface(
					[node.prev, node], dullCornerHash 
			);
			allPoints.push(...pointsOnShape1);
			
			let pointsOnShape2 = getBezierOsculatingCircles(node);
			allPoints.push(...pointsOnShape2);

			// TODO - remove; experimenting
			
			for (let i=1; i<2; i++) {
				let pos = new PointOnShape(
					node, 
					i/2, 
					MAT_CONSTANTS.pointType.standard, 
					0,
					0
				);
				allPoints.push(pos);
			}
			
			node = node.next;
		} while (node !== bezierLoop.head);

		// Ensure order - first point may be ordered last at this stage
		// (due to bezier-bezier interface checking)
		let firstPoint = allPoints[0];
		let lastPoint  = allPoints[allPoints.length-1];
		if (PointOnShape.compare(firstPoint, lastPoint) > 0) {
			allPoints.push(firstPoint); // Add the first point to the end
			allPoints.splice(0,1);      // ... and remove the front point.
		}	

		allPoints.sort(PointOnShape.compare);


		// Check if at least one 2-prong has been added. If not, add one.
		let atLeast1 = false;
		for (let i=0; i<allPoints.length; i++) {
			if (allPoints[i].type !== MAT_CONSTANTS.pointType.sharp) {
				atLeast1 = true;
				break;
			} 
		}
		//if (bezierLoop.indx === 0 && !atLeast1) {
		if (!atLeast1) {
			// Not a single potential 2-prong found on envelope. Add one 
			// to make the algorithm simpler from here on.
			let node = bezierLoop.head;
			
			let pos = new PointOnShape(
					node, 
					0.4999995, // Can really be anything in the range (0,1)
					MAT_CONSTANTS.pointType.standard, 
					0,
					0
			);
			
			allPoints.push(pos);
		}

		return allPoints;
	}


	/**
	 * Returns the boundary piece that starts at the immediate previous point on 
	 * the shape and ends at the immediate next point.  
	 * Note: Uses a red-black tree to quickly find the required bounds
	 */
	public static getNeighbouringPoints(
			shape: Shape, 
			pos: PointOnShape): ListNode<ContactPoint>[] {

		let k = pos.bezierNode.loop.indx;
		let cptree = shape.contactPointsPerLoop[k].cptree;
		
		//let cps = cptree.findBounds({ item: new ContactPoint(pos) });
		// TODO - ugly - improve code
		let cps = cptree.findBounds(
			new ListNode<ContactPoint>(
				undefined, 
				new ContactPoint(pos, undefined), 
				undefined, 
				undefined)
		);
		
		if (!cps[0] && !cps[1]) { 
			// The tree is still empty
			return [undefined, undefined];
		}
		
		if (!cps[0] || !cps[1]) { 
			// Smaller than all -> cptree.min() === cps[1].data OR
			// Larger than all -> cptree.max() === cps[0].data
			return [
				//LlRbTree.max(cptree.root), 
				//LlRbTree.min(cptree.root)
				cptree.max(cptree.root) as ListNode<ContactPoint>, 
				cptree.min(cptree.root) as ListNode<ContactPoint> 
			];
		}
		
		return [
			cps[0].data as ListNode<ContactPoint>, 
			cps[1].data as ListNode<ContactPoint>
		]; 
	}


	/**
	 * 
	 */
	public static getTotalCurvature = getTotalBy(
		function(bezierNode) {
			let bezierCurvature    = Bezier3.totalCurvature(bezierNode.item.bezier3, [0,1]);
			let interfaceCurvature = getCurvatureAtInterface(bezierNode); 
				
			return bezierCurvature + interfaceCurvature;
		}
	);


	/**
	 * 
	 */
	public static getTotalAbsoluteCurvature = getTotalBy(
		function(bezierNode) {
			return Bezier3.totalAbsoluteCurvature(bezierNode.item.bezier3, [0,1]) +
				Math.abs(getCurvatureAtInterface(bezierNode));
		}
	);


	/**
	 * 
	 */
	public static forAllBeziers = function(
			f: (ps: number[][]) => void, shape: Shape) {

		let bezierLoops = shape.bezierLoops;
		
		for (let i=0; i<bezierLoops.length; i++) {
			let bezierLoop = bezierLoops[i];
			
			let node = bezierLoop.head;
			do {
				let ps = node.item.bezier3;

				f(ps);
				
				node = node.next;
			} while (node !== bezierLoop.head);	
		}
	}


	/**
	 * Returns the ordered cubic bezier pieces (i.e a bezier with a t range) 
	 * from the given boundary piece.
	 * @param δ - An ordered pair that represents the start and ending points of 
	 * the boundary piece
	 * @param keepStraight - If true then don't go around any mat circles
	 */
	public static getBoundaryPieceBeziers = function(
			δ: ListNode<ContactPoint>[], 
			keepStraight: boolean = false) {

		let cp0 = δ[0]; 
		let cp1 = δ[1];
		
		let bezierPieces = [];
		
		// As opposed to going around the circle and taking the last exit
		let goStraight = true; 
		do {
			if (!goStraight && !keepStraight) {
				goStraight = true;
				// Actually, next, next, ..., i.e. take last exit
				cp0 = cp0.prevOnCircle; 
				continue;
			}

			goStraight = false;
			
			let posThis = cp0     .item.pointOnShape;
			let posNext = cp0.next.item.pointOnShape;

			if (posNext.bezierNode === posThis.bezierNode &&
				(posNext.t > posThis.t || (posNext.t === posThis.t && posNext.order > posThis.order))) {
				
				let pos = cp0.item.pointOnShape;
				let bezierPiece = new BezierPiece(pos.bezierNode, [pos.t, posNext.t]);
				bezierPieces.push(bezierPiece);
			} else {
				let pos = cp0.item.pointOnShape;
				let bezierPiece = new BezierPiece(pos.bezierNode, [pos.t, 1]);
				bezierPieces.push(bezierPiece);
				
				addSkippedBeziers(
						bezierPieces, 
						posThis.bezierNode, 
						posNext.bezierNode,
						posNext.t
				);
			}				
			
			cp0 = cp0.next;
		} while (cp0 !== cp1);
		

		return bezierPieces;
		
		
		/**
		 * Adds pieces of skipped beziers
		 */
		function addSkippedBeziers(
				bezierPieces: BezierPiece[], 
				bezierNode0: ListNode<PathCurve>, 
				bezierNode1: ListNode<PathCurve>, 
				t1: number) {

			let ii = 0;
			let bNode = bezierNode0;
			do {
				ii++;
				bNode = bNode.next;
				
				if (bNode === bezierNode1) {
					let bezierPiece = new BezierPiece(bNode, [0, t1]); 
					bezierPieces.push(bezierPiece);
				} else {
					let bezierPiece = new BezierPiece(bNode, [0, 1])
					bezierPieces.push(bezierPiece);
				}
			} while (bNode !== bezierNode1 && ii < 100);
			
			if (ii === 100) {
				console.log('maxed')
			}
		}
	}
}


/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornersArray
 */
function createSharpCornerCpLoops(
		shape: Shape, 
		sharpCornersArray: PointOnShape[][]) {

	let contactPointsPerLoop = [];
	let comparator = (a: ListNode<ContactPoint>, b: ListNode<ContactPoint>) => 
			ContactPoint.compare(a.item, b.item);

	for (let k=0; k<sharpCornersArray.length; k++) {
		let sharpCorners = sharpCornersArray[k];
		let cpLoop = new LinkedLoop([], comparator, k);
		
		let prevNode = undefined;
		for (let i=0; i<sharpCorners.length; i++) {
			let pos = sharpCorners[i];
			
			let cp = new ContactPoint(pos, undefined);
			prevNode = cpLoop.insert(cp, prevNode, undefined)
			
			let mCircle = MatCircle.create(
					PointOnShape.getOsculatingCircle(pos),
					[prevNode] 
			);
			prevNode.prevOnCircle = prevNode; // Trivial loop
			prevNode.nextOnCircle = prevNode; // ...
		}
		
		contactPointsPerLoop.push(cpLoop);
	}
	
	return contactPointsPerLoop;
}


/**
 * Destructively orient the bezier loops so that the outermost loop is
 * positively oriented (i.e. counter-clockwise).
 */
function orient(bezierLoops: LinkedLoop<PathCurve>[]): LinkedLoop<PathCurve>[] {
	let orientations = bezierLoops.map( 
			isPathPositivelyOrientated 
	); 
	
	//console.log(orientations)
	if (!orientations[0]) {
		return bezierLoops;		
	} else {
		let loops = bezierLoops.map(function(loop, k) {
			return reverseBeziersOrientation(loop, k)
		});
		
		return loops;
	}
}


/**
 * Completely reverse the loop direction of the given bezier loop. Returns the 
 * reversed loop.
 * @param bezierLoop
 * @param k
 */
function reverseBeziersOrientation(
		bezierLoop: LinkedLoop<PathCurve>, k: number): LinkedLoop<PathCurve> {

	let beziers = [];
	
	let bezierArray = bezierLoop.getAsArray();
	
	let idx = 0;
	for (let i=bezierArray.length-1; i>=0; i--) {
		let curve = PathCurve.reverse(bezierArray[i], idx);
		idx++;
		
		beziers.push(curve);
	}
	
	return new LinkedLoop(beziers, undefined, k);
}


/**
 * Returns the the top, left, bottom and right extreme points of the given
 * bezier loop, including the bezier nodes they belong to. If an extreme is at a 
 * bezier-bezier interface the first bezier will always be used (at t=1).
 */
let getLoopBounds = memoize(
	function(bezierLoop: LinkedLoop<PathCurve>) {
	
		const INF = Number.POSITIVE_INFINITY;
		
		let shapeBoundingBox = [[INF,  INF], [-INF, -INF]]; 
		let extremeBeziers: ListNode<PathCurve>[][] = [
			[undefined, undefined], 
			[undefined, undefined]
		]; 

		bezierLoop.forEach(function(bezierNode: ListNode<PathCurve>): void {
			let ps = bezierNode.item.bezier3; 
			let boundingBox = Bezier3.getBoundingBox(ps);
			//console.log(boundingBox)
			
			for (let i=0; i<2; i++) {
				for (let j=0; j<2; j++) {
					let v = boundingBox[i][j];
					let m = i === 0 ? 1 : -1;
					if (m*v < m*shapeBoundingBox[i][j]) { 
						shapeBoundingBox[i][j] = v;
						extremeBeziers[i][j] = bezierNode;
					}
				}
			}
		});

	
		return { shapeBoundingBox, extremeBeziers };
	}
);


/**
 * Returns true if the given beizer loop is positively orientated, false 
 * otherwise.
 */
let isPathPositivelyOrientated = function(
		bezierLoop: LinkedLoop<PathCurve>): boolean {

	const { extremeBeziers } = getLoopBounds(bezierLoop);

	const maxXBezierNode = extremeBeziers[1][0];
	const ps = maxXBezierNode.item.bezier3;
	
	const ts = Bezier3.getBounds(ps).ts;
	const tAtMaxX = ts[1][0];
	
	const tan = Bezier3.tangent(ps)(tAtMaxX);
	if (tAtMaxX !== 1) {
		// Not a sharp corner
		return tan[1] > 0;
	}

	const psNext = maxXBezierNode.next.item.bezier3;
	const tanNext = Bezier3.tangent(psNext)(0);
	
	if (tan[1] * tanNext[1] > 0) {
		// Both tangents points up or both points down.
		return tan[1] > 0;
	}
	
	// One tangent points up and the other down.
	return Vector.cross(tan, tanNext) > 0;
	
	// We don't check for the very special case where the cross === 0. 
}


/*
class LoopExtreme {
	p: number[];
	bezierNode: ListNode<number[][]>;
	t: number;

	constructor(p: number[], bezierNode: ListNode<number[][]>, t: number) {
		this.p = p;
		this.bezierNode = bezierNode;
		this.t = t;
	}
}
*/


/**
 * Get topmost point, bezierNode and t-value of the given loop.
 */
let getExtremes = memoize(
	function(bezierLoop: LinkedLoop<PathCurve>) {
		let { extremeBeziers } = getLoopBounds(bezierLoop);

		let bezierNode = extremeBeziers[0][1]; // Bezier at minimum y
		let ts = Bezier3.getBounds(bezierNode.item.bezier3).ts;
		let t = ts[0][1];
		let p = Bezier3.evaluate(bezierNode.item.bezier3)(t);
		
		//return new LoopExtreme(p, bezierNode, t);
		return ({ p, bezierNode, t});
	}
);


/**
 * Returns true if bezier box is entirely outside circle box, false otherwise.
 * 
 * Given a circle, bound it tightly by an axes-aligned box (i.e. circle 
 * box). And given a bezier, bound tightly by a rectangle (not 
 * necessarily axes aligned) (i.e. bezier box).
 */
function isBezierBoxWhollyOutsideCircleBox(
		ps: number[][], circle: Circle): boolean {
	
	//---- Cache
	let r = circle.radius;
	let ox = circle.center[0];
	let oy = circle.center[1];
	let radius_2 = r*r;
	
	//---- Translate bezier tight bounding box (4 point rectangle) so that circle center is at origin. 
	let boxTight = Vector.translatePs(
			[-ox, -oy],
			Bezier3.getBoundingBoxTight(ps) 
	);
	
	
	//---- Rotate circle and rectangle together so that box rectangle is aligned with axes.
	let boxDiagonal = Vector.fromTo(boxTight[0], boxTight[1]);
	let l = Vector.len(boxDiagonal);
	let sinθ = boxDiagonal[1] / l;
	let cosθ = boxDiagonal[0] / l;
	const rotateByθ = Vector.rotate(sinθ, -cosθ); 
	let b0 = rotateByθ(boxTight[0]);
	let b1 = rotateByθ(boxTight[2]);
	
	let anyBoxVerticalInside   = (b0[0] > -r && b0[0] < r) || 
	                             (b1[0] > -r && b1[0] < r);
	let boxVerticalsCapture    = (b0[0] < -r && b1[0] > r) ||
							     (b1[0] < -r && b0[0] > r);
	
	let anyBoxHorizontalInside = (b0[1] > -r && b0[1] < r) || 
	                             (b1[1] > -r && b1[1] < r);
	let boxHorizontalsCapture   = (b0[1] < -r && b1[1] > r) ||
							     (b1[1] < -r && b0[1] > r);
	if ( 
		(anyBoxVerticalInside   && (anyBoxHorizontalInside || boxHorizontalsCapture)) ||
		(anyBoxHorizontalInside && (anyBoxVerticalInside   || boxVerticalsCapture  )) ||
		(boxVerticalsCapture    && boxHorizontalsCapture)
	) {
		return false; 
	}
	
	return true;
}


/**
 * Floating-point 'safer' version of acos. If x is larger than 1 (or smaller 
 * than -1), still returns 0 (or Math.PI) instead of NAN.
 * @param x
 * @example 
 * 		acos(1);  //=> 0
 *      acos(2);  //=> 0
 */
function acos(x: number): number {
	if (x > 1) {
		return 0;
	} else if (x < -1) {
		return Math.PI;
	}
	
	return Math.acos(x);
}


/**
 * TODO - finish implementation - the function below with the same name
 * is temporary.
 * @param contactPointArr
 *//*
function createCoupledLoops(contactPointArr, k) {

	let comparator = (a,b) => ContactPoint.compare(a.item, b.item); 
	let cpLoop = new LinkedLoop([], comparator, k);
	
	let denseContactPoints = new LinkedLoop([], undefined, k);
	
	let prevCpNode = undefined;
	let prevCoupledCpNode = undefined;
	for (let i=0; i<contactPointArr.length; i++) {
		let cp = contactPointArr[i];
		let pos = cp.pointOnShape;
		
		prevCoupledCpNode = LinkedLoop.insert(
				denseContactPoints, cp, prevCoupledCpNode
		);
		// TODO !!!!
		/*
		if (pos.type === MAT_CONSTANTS.pointType.dull) {
			if (acos(1-pos.sharpness) * 180 / Math.PI > 16) {
				prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
			}
		} else if (pos.type === MAT_CONSTANTS.pointType.sharp) {
			if (acos(1-pos.sharpness) * 180 / Math.PI > 16) {
				prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
			}
		} else {*//*
			prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);	
		//}
		
		prevCoupledCpNode.coupledNode = prevCpNode; 
	}
	
	return cpLoop;
}*/
function createCoupledLoops(
		pointOnShapeArr: PointOnShape[], k: number) {
	
	let posLoop = new LinkedLoop<PointOnShape>([], undefined, k);
	
	let prevNode = undefined;
	for (let i=0; i<pointOnShapeArr.length; i++) {
		let pos = pointOnShapeArr[i];
	
		prevNode = posLoop.insert(pos, prevNode, undefined);	
	}
	
	return posLoop;
}


/**
 * TODO - uncomment and finish
 * Finds a point on the shape between the given contact points which
 * is as close as possible to a point with accumalated abs curvature
 * (from accumAtLeft) equal to totAtMid.
 *  
 * @param leftCp
 * @param rightCp
 * @param accumTotAtLeft
 * @param accumTotAtRight
 * @param totAtMid
 * @returns {PointOnShape}
 */
/*
function getCPointBetweenCps(
		leftCp: ContactPoint, 
		rightCp: ContactPoint,
		accumTotAtLeft: number,	
		accumTotAtRight: number,
		totAtMid: number) {
	
	let accumTo = totAtMid - accumTotAtLeft;  
	
	let posStart = leftCp .pointOnShape;
	let posEnd   = rightCp.pointOnShape;
	
	let bezierNodeStart = posStart.bezierNode;
	let bezierNodeEnd   = posEnd.  bezierNode;
	
	let bezierNode = bezierNodeStart;
	
	let totalTurn = 0;
	let totalCurvature = 0;
	do {
		let turn; 
		if (bezierNode !== bezierNodeEnd) {
			turn = Math.abs(getCurvatureAtInterface(bezierNode));
		} else {
			turn = 0;
		}
		
		
		let curvature;
		let interval = [0,1];
		if (bezierNode === bezierNodeStart) { interval[0] = posStart.t; }
		if (bezierNode === bezierNodeEnd)   { interval[1] = posEnd.t; }
		curvature = Bezier3.getTotalAbsoluteCurvature(bezierNode.item.bezier3)(interval);

		
		totalTurn += turn;
		totalCurvature += curvature;
		
		let totalBoth = totalTurn + totalCurvature;
		if (totalBoth >= accumTo) {
			// aaa console.log('accumTo: ' + accumTo, 'totalBoth: ' + totalBoth);
			break;
		}
		
		bezierNode = bezierNode.next;
	} while (bezierNode.prev !== bezierNodeEnd);

	
	//return { totalTurn, totalCurvature };
}
*/

/**
 * TODO - uncomment and finish
 */
/*
function sumCurvatures(curvatures: number[]): number {
	let total = 0;
	
	for (let i=0; i<curvatures.length; i++) {
		let c = curvatures[i].c;
		
		total += c.totalTurn + c.totalCurvature;
	}
	
	return total;
}
*/


/**
 * TODO - uncomment and finish
 * Calculates and returns total absolute curvature between
 * the given contact points.
 * @param {ContactPoint[]}
 * @returns {Object}
 */
/*
function getTotalAbsCurvatureBetweenCps([cpStart, cpEnd]) {
	let posStart = cpStart.pointOnShape;
	let posEnd   = cpEnd.  pointOnShape;
	
	let bezierNodeStart = posStart.bezierNode;
	let bezierNodeEnd   = posEnd.  bezierNode;
	
	let bezierNode = bezierNodeStart;
	
	let totalTurn = 0;
	let totalCurvature = 0;
	do {
		let turn; 
		if (bezierNode !== bezierNodeEnd) {
			turn = Math.abs(getCurvatureAtInterface(bezierNode));
		} else {
			turn = 0;
		}
		
		
		let curvature;
		let interval = [0,1];
		if (bezierNode === bezierNodeStart) { interval[0] = posStart.t; }
		if (bezierNode === bezierNodeEnd)   { interval[1] = posEnd.t; }
		curvature = Bezier3.getTotalAbsoluteCurvature(bezierNode.item.bezier3)(interval);

		
		totalTurn += turn;
		totalCurvature += curvature;
		
		bezierNode = bezierNode.next;
	} while (bezierNode.prev !== bezierNodeEnd);

	
	return { totalTurn, totalCurvature };
}
*/


/**
 * Get the angle between the given bezier endpoint and the
 * startpoint of the next bezier.
 * @param bezierNode
 */
function getCurvatureAtInterface(bezierNode: ListNode<PathCurve>) {
	const ts = [1,0];
	
	let pss = [
		bezierNode.item.bezier3,
		bezierNode.next.item.bezier3
	];
	
	let tans = [ 
		Bezier3.tangent(pss[0])(1), 
		Bezier3.tangent(pss[0])(0)
	];
	
	// The integral of a kind of Dirac Delta function.
	let cosθ = Vector.dot  (tans[0], tans[1]);
	let sinθ = Vector.cross(tans[0], tans[1]);
	let θ = acos(cosθ);
	
	let result = sinθ >= 0 ? θ : -θ;
	
	return result;
}


/**
 * @description Helper function.
 * @param f
 * @returns {Funtion}
 */
function getTotalBy(f: (bezierNode: ListNode<PathCurve>) => number) {
	
	return function(bezierLoop: LinkedLoop<PathCurve>) {
		let node = bezierLoop.head;
		let total = 0;
		do {
			total += f(node);
			
			node = node.next;
		} while (node !== bezierLoop.head);
		
		return total;		
	}
}


export default Shape;
