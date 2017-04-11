'use strict'

let getContactCirclesAtBezierBezierInterface = 
	require('../functions/get-contact-circles-at-bezier-bezier-interface.js');
let getBezierOsculatingCircles = 
	require('../functions/get-bezier-osculating-circles.js');
let Util             = require('../../utils.js');
let Geometry         = require('../../geometry/geometry.js');
let LlRbTree         = require('../../ll-rb-tree//ll-rb-tree.js');
let LinkedLoop       = require('../../linked-loop/linked-loop.js');
let Bezier           = require('../../geometry/classes/bezier.js');
let ContactPoint     = require('../../mat/classes/contact-point.js');
let PointOnShape     = require('../../geometry/classes/point-on-shape.js');
let Svg              = require('../../svg/svg.js');
let MatCircle        = require('../../mat/classes/mat-circle.js');
let Vector           = require('../../vector/vector.js');
let MAT_CONSTANTS    = require('../../mat-constants.js');


/** 
 * A Shape represents the loop of individual bezier curves composing 
 * an SVG element.
 * 
 * @constructor  
 */
let Shape = function(beziers, _debug_) {
		
	this.beziers = beziers;
	this.dullCornerHash = {};
	
	let pointsOnShape = getInterestingPointsOnShape(this);
	let usedPointsOnShape = determineUsedPoints(this, pointsOnShape);
	let contactPointArr = usedPointsOnShape.map(createContactPoint);
	
	this.contactPoints = createCoupledCpLoops(contactPointArr);
	
	//respacePoints(this.contactPoints, 30); 
	respacePoints(this.contactPoints, 45);

	this.for2Prongs = 
		addPrelimMatCircles_CullPoints_AndGetPotential2Prongs(
				this.contactPoints, _debug_
		);
	
	
	if (_debug_) { 
		debugActionsOnShapeCreate(this, contactPointArr, _debug_);
	}
	
	function createContactPoint(pos) {
		return new ContactPoint(pos, undefined);
	}
}


function determineUsedPoints(shape, pointsOnShape) {
	let usedPointsOnShape = [];
	
	for (let pos of pointsOnShape) {
		let intersects = Geometry.doesCircleIntersectShape(
				shape,
				pos.osculatingCircle, 
				pos
		);	
		
		pos.intersects = intersects;
		
		if (pos.type !== MAT_CONSTANTS.pointType.dull) {
			if (intersects) {
				usedPointsOnShape.push(pos);
			} else {
				usedPointsOnShape.push(pos);
			}
		} else if (intersects) {
			// Will later become a 2-prong point.
			usedPointsOnShape.push(pos);
		} else if (pos.type === MAT_CONSTANTS.pointType.dull) {
			if (!intersects) {
				usedPointsOnShape.push(pos);
			}
		}
	}
	
	return usedPointsOnShape;
}


function createCoupledCpLoops(contactPointArr) {
	
	let cpLoop = new LinkedLoop([], 
		function(a,b) {
			return ContactPoint.compare(a.item, b.item);
		}
	);
	
	let denseContactPoints = new LinkedLoop([], undefined);
	
	let prevCpNode = undefined;
	let prevCoupledCpNode = undefined;
	for (let i=0; i<contactPointArr.length; i++) {
		let cp = contactPointArr[i];
		let pos = cp.pointOnShape;
		
		prevCoupledCpNode = LinkedLoop.insert(
				denseContactPoints, cp, prevCoupledCpNode
		);
		
		if (pos.type === MAT_CONSTANTS.pointType.dull) {
			if (Math.acos(1-pos.sharpness) * 180 / Math.PI > 16) {
				prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
			}
		} else if (pos.type === MAT_CONSTANTS.pointType.sharp) {
			if (Math.acos(1-pos.sharpness) * 180 / Math.PI > 16) {
				prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
			}
		} else {
			prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);	
		}
		
		prevCoupledCpNode.coupledNode = prevCpNode; 
	}
	
	return cpLoop;
}


/**
 * 
 * @param contactPoints
 * @returns
 */
function addPrelimMatCircles_CullPoints_AndGetPotential2Prongs(
		contactPoints, _debug_) {
	
	let cpNode = contactPoints.head;
	let for2Prongs = []; // The points that will be used for the initial 2-prong procedure
	let toRemove = []; // Don't remove items inside loop.
	do {
		let cp = cpNode.item;
		let pos = cp.pointOnShape;
		let mCircle = MatCircle.create(
				pos.osculatingCircle,
				[cpNode]
		);
		

		if (pos.intersects) {
			for2Prongs.push(cpNode);
		} else if (pos.type === MAT_CONSTANTS.pointType.dull) {
			/* TODO IMPORTANT remove this line, uncomment piece below 
			 * it and implement the following strategy to find the 
			 * 3-prongs: if deltas are conjoined due to dull corner, 
			 * split the conjoinment by inserting successively closer 
			 * (binary division) 2-prongs. If a 2-prong actually fails, 
			 * simply remove the 1-prong at the dull corner.
			 */
			//console.log(cpNode);
			toRemove.push(cpNode);
			/*
			var oCircle = cp.matCircle;

			if (_debug_) {
				_debug_.draw.circle(oCircle.circle, 'orange thin10 nofill');
				_debug_.draw.dot(oCircle.circle.center, 0.5, 'orange');	
			}
			*/
			
		} else if (pos.type === MAT_CONSTANTS.pointType.osculating) { 
			if (_debug_) {
				_debug_.draw.dot(cp, 0.2, 'gray');
				_debug_.draw.dot(cp.matCircle.circle.center, 0.5, 'gray');
				_debug_.draw.circle(cp.matCircle.circle, 'gray thin10 nofill');
			}
		}
		

		cpNode.prevOnCircle = cpNode; // Trivial loop
		cpNode.nextOnCircle = cpNode; // ...

		cpNode = cpNode.next;
	} while (cpNode !== contactPoints.head);
	
	for (let i=0; i<toRemove.length; i++) {
		let cpNode = toRemove[i];
		LinkedLoop.remove(contactPoints, cpNode);
	}
	
	return for2Prongs;
}

/**
 * Respace points so that the total absolute curvature between
 * consecutive points are very roughly equal. 
 * 
 * @param {LinkedLoop<ContactPoint>} contactPoints
 * @returns undefined
 * 
 * NOTES: Mutates contactPoints.
 */
function respacePoints(contactPoints, maxAbsCurvatureInDegrees) {
 
	//let iii = 0;
	
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
				
				//iii++;

				//console.log(cpNode, newCpNode);
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
	} while (cpNode !== contactPoints.head/* && iii < 100*/);
	
	//console.log(iii);
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
		curvature = bezierNode.item.getTotalAbsoluteCurvature(
			interval
		);

		
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
		curvature = bezierNode.item.getTotalAbsoluteCurvature(
			interval
		);

		
		totalTurn += turn;
		totalCurvature += curvature;
		
		bezierNode = bezierNode.next;
	} while (bezierNode.prev !== bezierNodeEnd);

	
	return { totalTurn, totalCurvature };
}


function debugActionsOnShapeCreate(shape, contactPointArr, _debug_) {
	for (let contactPoint of contactPointArr) {
		if (contactPoint.pointOnShape.type === MAT_CONSTANTS.pointType.sharp) {
			_debug_.draw.dot(contactPoint.pointOnShape, 0.2, 'green');
		}
		if (contactPoint.pointOnShape.type === MAT_CONSTANTS.pointType.dull) {
			_debug_.draw.dot(contactPoint.pointOnShape, 0.4, 'orange');
			//_debug_.draw.dot(contactPoint.pointOnShape, 1.5, 'orange');
		}
	}

	_debug_.shape = shape;
	if (_debug_.drawStuff) {
		_debug_.drawSomeStuff(shape);
	}	
}


/**
 * 
 * @param {Shape} shape
 * @returns {[{pointOnShape}]} - A list of interesting points on the 
 * 			shape.
 */
function getInterestingPointsOnShape(shape) {
	let beziers = shape.beziers;
	let dullCornerHash = shape.dullCornerHash;
	
	let points = [];
	let allPoints = [];
	
	let node = beziers.head;
	do {
		let bezier = node.item;

		let pointsOnShape;
		pointsOnShape = getContactCirclesAtBezierBezierInterface(
				[node.prev, node], dullCornerHash 
		);
		Array.prototype.push.apply(allPoints, pointsOnShape);
		pointsOnShape = getBezierOsculatingCircles(node);
		Array.prototype.push.apply(allPoints, pointsOnShape);
		
		node = node.next;
	} while (node !== beziers.head);
	
	// Ensure order - first point may be ordered last at this stage.
	let firstPoint = allPoints[0];
	let lastPoint  = allPoints[allPoints.length-1];
	if (PointOnShape.compare(firstPoint, lastPoint) > 0) {
		allPoints.push(firstPoint); // Add the first point to the end
		allPoints.splice(0,1);      // ... and remove the front point.
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
Shape.getNeighbouringPoints = function(shape, pointOnShape) {
	
	var cptree = shape.contactPoints.cptree;
	
	var cps = LlRbTree.findBounds(cptree, { item: new ContactPoint(pointOnShape) });
	
	if (!cps[0]) { // Smaller than all -> cptree.min() === cps[1].data
		return [LlRbTree.max(cptree.root), LlRbTree.min(cptree.root)]
	}
	if (!cps[1]) { // Larger than all -> cptree.max() === cps[0].data
		return [LlRbTree.max(cptree.root), LlRbTree.min(cptree.root)];
	}
	
	return [cps[0].data, cps[1].data]; 
}


function getTotalBy(f, shape) {
	
	return function(shape) {
		let beziers = shape.beziers;
		
		let node = beziers.head;
		let total = 0;
		do {
			total += f(node);
			
			node = node.next;
		} while (node !== beziers.head);
		
		return total;		
	}
}


/**
 * 
 * 
 * @param bezierNode
 * @returns
 */
function getCurvatureAtInterface(bezierNode) {
	const ts = [1,0];
	
	let beziers = [];
	
	beziers.push(bezierNode.item);
	beziers.push(bezierNode.next.item);
	let tans = [ 
		beziers[0].tangent(1), 
		beziers[1].tangent(0)
	];
	
	// The integral of a kind of Dirac Delta function.
	let cosθ = Vector.dot  (tans[0], tans[1]);
	let sinθ = Vector.cross(tans[0], tans[1]);
	let θ = Math.acos(cosθ);
	
	return sinθ >= 0 ? θ : -θ;
}


Shape.getTotalCurvature = getTotalBy(function(bezierNode) {
	return +
		bezierNode.item.getTotalCurvature() +
		getCurvatureAtInterface(bezierNode);
});


Shape.getTotalAbsoluteCurvature = getTotalBy(function(bezierNode) {
	return bezierNode.item.getTotalAbsoluteCurvature() +
			Math.abs(getCurvatureAtInterface(bezierNode));
});


Shape.forAllBeziers = function(shape, f) {
	let node = shape.beziers.head;
	do {
		let bezier = node.item;

		f(bezier);
		
		node = node.next;
	} while (node !== shape.beziers.head);
}


module.exports = Shape;


//218