'use strict'

let MAT_CONSTANTS    = require('../../mat-constants.js');

let Util         = require('../../utils.js');
let Poly         = require('../../polynomial/polynomial.js');
let Vector       = require('../../vector/vector.js');
let Memoize      = require('../../memoize.js');

let LlRbTree     = require('../../ll-rb-tree//ll-rb-tree.js');
let LinkedLoop   = require('../../linked-loop/linked-loop.js');
let Bezier       = require('../../geometry/classes/bezier.js');
let BezierPiece  = require('../../geometry/classes/bezier-piece.js');
let ContactPoint = require('../../mat/classes/contact-point.js');
let PointOnShape = require('../../geometry/classes/point-on-shape.js');
let Svg          = require('../../svg/svg.js');
let MatCircle    = require('../../mat/classes/mat-circle.js');


let getContactCirclesAtBezierBezierInterface = 
	require('../functions/get-contact-circles-at-bezier-bezier-interface.js');
let getBezierOsculatingCircles = 
	require('../functions/get-bezier-osculating-circles.js');


/** 
 * A Shape represents the loop of individual bezier curves composing 
 * an SVG element. When constructed, some initial analysis is done. 
 * 
 * @constructor  
 */
let Shape = function(bezierArrays) {

	// Hash of PointOnShapes that has a normal pointing straight up. 
	this.straightUpHash = {}; 
	// Hash of 2-prongs that need to be skipped in 2-prong procedure
	// since we already have a hole-closing 2-prong there.
	this.skip2ProngHash = {};
	// A hash of all the dull corners (i.e. those with angle > 180 deg)
	this.dullCornerHash = {};
	
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

	// Get metrics of the outer loop.
	this.metrics = getPathMetrics(bezierLoops[0]);
	
	// Gets interesting points on the shape, i.e. those that makes 
	// sense to use for the 2-prong procedure.
	let pointOnShapeArrPerLoop = getInterestingPointsOnShape(this);
	
	this.pointsOnShapePerLoop = pointOnShapeArrPerLoop.map(
			(array, i) => createCoupledLoops(array, i) 
	);

	
	// TODO Finish implementation. This is to space the points more
	// evenly. 
	//respacePoints(this.contactPointsPerLoop, 30);
	
	let { sharpCornersArray, for2ProngsArray } = 
		getPotential2Prongs(this);
	this.for2ProngsArray = for2ProngsArray;
	
	
	// Take account of sharp and dull corners for debugging and update 
	// straightUpHash.
	Shape.forEachPointOnShape(this, pos => {
		if (pos.type === MAT_CONSTANTS.pointType.sharp) {
			if (MatLib._debug_) {
				MatLib._debug_.generated.sharpCorners.push({pos});
			}			
		} else {
			if (PointOnShape.isPointingStraightUp(pos)) {
				let key = PointOnShape.makeSimpleKey(pos);
				this.straightUpHash[key] = pos;	
			}
			
			if (MatLib._debug_) {
				if (pos.type === MAT_CONSTANTS.pointType.dull) {
					MatLib._debug_.generated.dullCorners.push({pos});
				}
			}
		}
	});
	
	
	this.contactPointsPerLoop = 
		createSharpCornerCpLoops(this, sharpCornersArray);
}


/**
 * @description Creates the initial ContactPoint loops from the given
 * sharp corners.
 * @param {Shape} shape
 * @param {PointOnShape[][]} sharpCornersArray
 * @returns
 */
function createSharpCornerCpLoops(shape, sharpCornersArray) {
	let contactPointsPerLoop = [];
	let comparator = (a,b) => ContactPoint.compare(a.item, b.item);
	for (let k=0; k<sharpCornersArray.length; k++) {
		let sharpCorners = sharpCornersArray[k];
		let cpLoop = new LinkedLoop([], comparator, k);
		
		let prevNode = undefined;
		for (let i=0; i<sharpCorners.length; i++) {
			let pos = sharpCorners[i];
			
			let cp = new ContactPoint(pos, undefined);
			prevNode = LinkedLoop.insert(cpLoop, cp, prevNode)
			
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
 * @description Orient the bezier loops so that the outermost loop is
 * positively oriented (i.e. counter-clockwise).
 * @modifies bezierLoops
 */
function orient(bezierLoops) {
	let orientations = bezierLoops.map( 
			isPathPositivelyOrientated 
	); 
	
	
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
 * Completely reverse the loop direction of the given bezier loop.
 * @param bezierLoop
 * @param k
 * @returns The reversed loop.
 */
function reverseBeziersOrientation(bezierLoop, k) {
	let beziers = [];
	
	let bezierArray = LinkedLoop.getAsArray(bezierLoop);
	
	let idx = 0;
	for (let i=bezierArray.length-1; i>=0; i--) {
		let bezier = reverseBezier(bezierArray[i], idx);
		idx++;
		
		beziers.push(bezier);
	}
	
	return new LinkedLoop(beziers, undefined, k);
}


/**
 * @description Reverse the given bezier and assign the new given idx.
 * @param bezier
 * @param idx
 * @returns The freshly reversed bezier.
 */
function reverseBezier(bezier, idx) {
	let bezierPoints = [];
	for (let i=3; i>=0; i--) {
		bezierPoints.push(bezier.bezierPoints[i]);
	}
	let newBezier = new Bezier(bezierPoints, idx);
	
	return newBezier;
}


/**
 * @description Get the path metrics, i.e. the top, left, bottom and 
 * right extremes of the bezer loop, together with the bezier nodes 
 * they belong to. If an extreme is at a bezier-bezier interface the
 * first bezier will always be utilized (at t=1).
 */
let getPathMetrics = Memoize.m1(function(bezierLoop) {
	
	const INF = Number.POSITIVE_INFINITY;
	
	let metrics = [[INF,  INF], [-INF, -INF]]; 
	let extremeBeziers = [
		[undefined, undefined], 
		[undefined, undefined]
	]; 
	
	LinkedLoop.forEach(bezierLoop, function(bezierNode) {
		let bezier = bezierNode.item;
		let boundingBox = Bezier.getBoundingBox(bezier);
		
		for (let i=0; i<2; i++) {
			for (let j=0; j<2; j++) {
				let v = boundingBox[i][j];
				let m = i === 0 ? 1 : -1;
				if (m*v < m*metrics[i][j]) { 
					metrics[i][j] = v;
					extremeBeziers[i][j] = bezierNode;
				}		
			}
		}
	});


	return { metrics, extremeBeziers };
});


/**
 * @description Checks if a shape is positively orientated or not. 
 */
let isPathPositivelyOrientated = function(bezierLoop) {
	let { extremeBeziers } = getPathMetrics(bezierLoop);
	
	let maxXBezierNode = extremeBeziers[1][0];
	
	let ts = Bezier.getBounds(maxXBezierNode.item).ts;
	let tAtMaxX = ts[1][0];
	
	let tan1 = Bezier.tangent(maxXBezierNode.item)(tAtMaxX);
	if (tAtMaxX !== 1) {
		return tan1[1] > 0;
	}

	let tan2 = Bezier.tangent(maxXBezierNode.next.item)(0);
	
	if (tan1[1] * tan2[1] > 0) {
		// Both tangents points up or both points down.
		return tan1[1] > 0;
	}
	
	// One tangent points up and the other down.
	return Vector.cross(tan1, tan2) > 0;
	
	// We don't check for the very special case where the cross === 0. 
}


/**
 * @description Get topmost point, bezierNode and t-value of the given
 * loop.
 */
let getExtremes = Memoize.m1(function(bezierLoop) {
	
	let { extremeBeziers } = getPathMetrics(bezierLoop);

	let bezierNode = extremeBeziers[0][1]; // Bezier at minimum y
	let ts = Bezier.getBounds(bezierNode.item).ts;
	let t = ts[0][1];
	let p = Bezier.evaluate(bezierNode.item)(t);
	
	return { p, bezierNode, t };
});


/**
 * Given a circle, bound it tightly by an axes-aligned box (i.e. circle 
 * box). And given a bezier, bound tightly by a rectangle (not 
 * necessarily axes aligned) (i.e. bezier box).
 *  
 * @returns {boolean} true if bezier box is entirely outside circle box.
 *  
 */
function isBezierBoxWhollyOutsideCircleBox(bezier, circle) {
	
	//---- Cache
	let r = circle.radius;
	let ox = circle.center[0];
	let oy = circle.center[1];
	let radius_2 = r*r;
	
	//---- Translate bezier tight bounding box (4 point rectangle) so that circle center is at origin. 
	let boxTight = Vector.translatePoints(
			Bezier.getBoundingBoxTight(bezier), 
			[-ox, -oy]
	);
	
	
	//---- Rotate circle and rectangle together so that box rectangle is aligned with axes.
	let boxDiagonal = Vector.fromTo(boxTight[0], boxTight[1]);
	let l = Vector.length(boxDiagonal);
	let sinAngle = boxDiagonal[1] / l;
	let cosAngle = boxDiagonal[0] / l;
	let b0 = Vector.rotate(boxTight[0], sinAngle, -cosAngle);
	let b1 = Vector.rotate(boxTight[2], sinAngle, -cosAngle);
	
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
 * TODO - finish implementation - the function below with the same name
 * is temporary.
 * @description
 * @param contactPointArr
 * @returns
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
			if (Util.acos(1-pos.sharpness) * 180 / Math.PI > 16) {
				prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
			}
		} else if (pos.type === MAT_CONSTANTS.pointType.sharp) {
			if (Util.acos(1-pos.sharpness) * 180 / Math.PI > 16) {
				prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
			}
		} else {*//*
			prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);	
		//}
		
		prevCoupledCpNode.coupledNode = prevCpNode; 
	}
	
	return cpLoop;
}*/
function createCoupledLoops(pointOnShapeArr, k) {
	
	let posLoop = new LinkedLoop([], undefined, k);
	
	let prevNode = undefined;
	for (let i=0; i<pointOnShapeArr.length; i++) {
		let pos = pointOnShapeArr[i];
	
		prevNode = LinkedLoop.insert(posLoop, pos, prevNode, undefined);	
	}
	
	return posLoop;
}


/**
 * @description Applies f to each PointOnShape within the shape
 * @param {function(PointOnShape)} f - Function to call. 
 */
Shape.forEachPointOnShape = function(shape, f) {
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
 * @description .
 * @param shape
 * @returns
 */
function getPotential2Prongs(shape) {
	
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
 * TODO - finish implementation
 * Respace points so that the total absolute curvature between
 * consecutive points are very roughly equal. 
 * 
 * @param {LinkedLoop<ContactPoint>[]} contactPointsPerLoop
 * @returns undefined
 * 
 * NOTES: Mutates contactPoints.
 */
function respacePoints(contactPointsPerLoop, maxAbsCurvatureInDegrees) {
	
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
					*/
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
}


/**
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
function getCPointBetweenCps(
		leftCp, rightCp,
		accumTotAtLeft,	accumTotAtRight,
		totAtMid) {
	
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
		curvature = Bezier.getTotalAbsoluteCurvature(bezierNode.item)(interval);

		
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


function sumCurvatures(curvatures) {
	let total = 0;
	
	for (let i=0; i<curvatures.length; i++) {
		let c = curvatures[i].c;
		
		total += c.totalTurn + c.totalCurvature;
	}
	
	return total;
}


/**
 * 
 * @param cps
 * @returns
 */
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
		curvature = Bezier.getTotalAbsoluteCurvature(bezierNode.item)(interval);

		
		totalTurn += turn;
		totalCurvature += curvature;
		
		bezierNode = bezierNode.next;
	} while (bezierNode.prev !== bezierNodeEnd);

	
	return { totalTurn, totalCurvature };
}


/**
 * @description Get useful points on the shape - these incude osculating
 * points and points at the bezier-bezier interfaces.  
 * @param {Shape} shape
 * @returns {[{pointOnShape}]} - A list of interesting points on the 
 * 			shape.
 */
function getInterestingPointsOnShape(shape) {
	let bezierLoops = shape.bezierLoops;
	let allPointsArray = [];
	
	for (let k=0; k<bezierLoops.length; k++) {
		let bezierLoop = bezierLoops[k];
		
		allPointsArray.push( 
				getInterestingPointsOnLoop( shape, bezierLoop ) 
		);
	}
		
	return allPointsArray;
}


function getInterestingPointsOnLoop(shape, bezierLoop) {
	let dullCornerHash = shape.dullCornerHash;
	
	let points = [];
	let allPoints = [];
	
	let node = bezierLoop.head;
	do {
		let bezier = node.item;

		let pointsOnShape1 = getContactCirclesAtBezierBezierInterface(
				[node.prev, node], dullCornerHash 
		);
		Array.prototype.push.apply(allPoints, pointsOnShape1);
		
		let pointsOnShape2 = getBezierOsculatingCircles(node);
		Array.prototype.push.apply(allPoints, pointsOnShape2);
		
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

	
	// Check if at least one 2-prong has been added. If not, add one.
	let atLeast1 = false;
	for (let i=0; i<allPoints.length; i++) {
		if (allPoints[i].type !== MAT_CONSTANTS.pointType.sharp) {
			atLeast1 = true;
			break;
		} 
	}
	if (bezierLoop.indx === 0 && !atLeast1) {
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
 * Returns the boundary piece that starts at the 
 * immediate previous point on the shape and ends at 
 * the immediate next point.  
 * 
 * Notes:
 *   - Uses a red-black tree to quickly find the required bounds
 */
Shape.getNeighbouringPoints = function(shape, pos) {
	let k = pos.bezierNode.loop.indx;
	let cptree = shape.contactPointsPerLoop[k].cptree;
	
	let cps = LlRbTree.findBounds(
			cptree, { item: new ContactPoint(pos) }
	);
	
	if (cps === null) { // The tree is still empty
		 return [undefined, undefined];
	}
	
	if (!cps[0]) { // Smaller than all -> cptree.min() === cps[1].data
		return [LlRbTree.max(cptree.root), LlRbTree.min(cptree.root)]
	}
	if (!cps[1]) { // Larger than all -> cptree.max() === cps[0].data
		return [LlRbTree.max(cptree.root), LlRbTree.min(cptree.root)];
	}
	
	return [cps[0].data, cps[1].data]; 
}



/**
 * @description
 * @param bezierNode
 * @returns
 */
function getCurvatureAtInterface(bezierNode) {
	const ts = [1,0];
	
	let beziers = [];
	
	beziers.push(bezierNode.item);
	beziers.push(bezierNode.next.item);
	let tans = [ 
		Bezier.tangent(beziers[0])(1), 
		Bezier.tangent(beziers[1])(0)
	];
	
	// The integral of a kind of Dirac Delta function.
	let cosθ = Vector.dot  (tans[0], tans[1]);
	let sinθ = Vector.cross(tans[0], tans[1]);
	let θ = Util.acos(cosθ);
	
	let result = sinθ >= 0 ? θ : -θ;
	
	return result;
}


/**
 * @description Helper function.
 * @param f
 * @returns
 */
function getTotalBy(f) {
	
	return function(bezierLoop) {
		let node = bezierLoop.head;
		let total = 0;
		do {
			total += f(node);
			
			node = node.next;
		} while (node !== bezierLoop.head);
		
		return total;		
	}
}


/**
 * 
 */
Shape.getTotalCurvature = getTotalBy(
	function(bezierNode) {
		let bezierCurvature    = Bezier.getTotalCurvature(bezierNode.item);
		let interfaceCurvature = getCurvatureAtInterface(bezierNode); 
	 		
		return bezierCurvature + interfaceCurvature;
	}
);


/**
 * 
 */
Shape.getTotalAbsoluteCurvature = getTotalBy(
	function(bezierNode) {
		return Bezier.getTotalAbsoluteCurvature(bezierNode.item)() +
			Math.abs(getCurvatureAtInterface(bezierNode));
	}
);


/**
 * 
 */
Shape.forAllBeziers = function(f, shape) {
	let bezierLoops = shape.bezierLoops;
	
	for (let i=0; i<bezierLoops.length; i++) {
		let bezierLoop = bezierLoops[i];
		
		let node = bezierLoop.head;
		do {
			let bezier = node.item;

			f(bezier);
			
			node = node.next;
		} while (node !== bezierLoop.head);	
	}
}


/**
 * @description
 */
Shape.getBoundaryBeziers = function(shape, k) {
	let bezierLoop = shape.bezierLoops[k];
	let bezierPieces = [];

	LinkedLoop.forEach(bezierLoop, function(bezierNode) {
		let bezierPiece = new BezierPiece(
				bezierNode, [0, 1]
		);
		
		bezierPieces.push(bezierPiece);
	});
	
	return bezierPieces;
}


/**
 * @description
 */
Shape.getBoundaryPieceBeziers = function(δ) {

	let cp0 = δ[0]; 
	let cp1 = δ[1];
	
	let bezierPieces = [];
	
	// As opposed to going around the circle and taking the last exit
	let goStraight = true; 
	do {
		if (goStraight) {
			goStraight = false;
			
			let posThis = cp0     .item.pointOnShape;
			let posNext = cp0.next.item.pointOnShape;

			if (posNext.bezierNode === posThis.bezierNode &&
				(posNext.t > posThis.t || (posNext.t === posThis.t && posNext.order > posThis.order))) {
				
				let pos = cp0.item.pointOnShape;
				let bezierPiece = new BezierPiece(pos.bezierNode, [pos.t, posNext.t]);
				bezierPieces.push(bezierPiece);
				//MatLib._debug_.draw.bezierPiece(bezierPiece, 'nofill thin50 red');	
			} else {
				let pos = cp0.item.pointOnShape;
				let bezierPiece = new BezierPiece(pos.bezierNode, [pos.t, 1]);
				bezierPieces.push(bezierPiece);
				//MatLib._debug_.draw.bezierPiece(bezierPiece, 'nofill thin50 blue');
				
				addSkippedBeziers(
						bezierPieces, 
						posThis.bezierNode, 
						posNext.bezierNode,
						posNext.t
				);
			}				
			
			cp0 = cp0.next;
		} else {
			goStraight = true;
			
			// Actually, next, next, ..., i.e. take last exit
			cp0 = cp0.prevOnCircle; 
		}
	} while (cp0 !== cp1);
	

	return bezierPieces;
	
	
	/**
	 * Adds pieces of skipped beziers
	 */
	function addSkippedBeziers(
			bezierPieces, bezierNode0, bezierNode1, t1) {

		let ii = 0;
		let bNode = bezierNode0;
		do {
			ii++;
			bNode = bNode.next;
			
			if (bNode === bezierNode1) {
				let bezierPiece = new BezierPiece(bNode, [0, t1]); 
				bezierPieces.push(bezierPiece);
				//MatLib._debug_.draw.bezierPiece(bezierPiece, 'nofill thin50 green');
			} else {
				let bezierPiece = new BezierPiece(bNode, [0, 1])
				bezierPieces.push(bezierPiece);
				//MatLib._debug_.draw.bezierPiece(bezierPiece, 'nofill thin50 pink');
			}
		} while (bNode !== bezierNode1 && ii < 100);
		
		if (ii === 100) {
			console.log('maxed')
		}
	}
}


module.exports = Shape;
