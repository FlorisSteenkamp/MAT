'use strict'

const MAX_ITERATIONS = 50;
//TODO Change tolerances to take shape dimension into 
// account, e.g. shapeDim / 10000 for SEPERATION_TOLERANCE;
//CONST SEPERATION_TOLERANCE = 1e-3;
const SEPERATION_TOLERANCE = 1e-2;
const SQUARED_SEPERATION_TOLERANCE = 
		SEPERATION_TOLERANCE * SEPERATION_TOLERANCE;
//const ERROR_TOLERANCE = 1e-3;
const ERROR_TOLERANCE = SEPERATION_TOLERANCE / 10;
const SQUARED_ERROR_TOLERANCE = 
		ERROR_TOLERANCE * ERROR_TOLERANCE;


let Circle = require('../../geometry/classes/circle.js');
let Geometry = require('../../geometry/geometry.js');
let Shape = require('../../geometry/classes/shape.js');
let LinkedLoop = require('../../linked-loop/linked-loop.js');
let getClosestBoundaryPointToPoint = 
	require('../../geometry/functions/get-closest-boundary-point-to-point.js');
let Vector = require('../../vector/vector.js');
let PointOnShape = require('../../geometry/classes/Point-on-shape.js');



/**
 * Adds a 2-prong to the MAT. The first point is given and the second
 * one is found by the algorithm.
 * 
 * A 2-prong is a MAT circle that touches the shape in 2 points.
 * 
 * @param shape
 * @param {ListNode<ContactPoint>} cpNode The first point of the 2-prong.
 * @param _debug_ Used for debugging only.
 * 
 * Before any 2-prongs are added the entire shape is our d-Omega δΩ
 * (1-prongs does not reduce the boundary),
 * 
 * As per the paper by Choi, Choi, Moon and Wee: 
 *   "The starting point of this algorithm is a choice of a circle
 *    Br(x) centered at an interior point x which contains two boundary
 *    portions c and d of d-Omega as in Fig. 19."
 * In fact, we (and they) start by fixing one point on the boundary
 * beforehand. 
 */
function find2Prong(shape, cpNode, _debug_) {
	
	// The first point on the shape of the 2-prong.
	let y = cpNode.item.pointOnShape;
	
	/* The boundary piece that should contain the other point of 
	 * the 2-prong circle. (Defined by start and end points).
	 */
	let δ = [cpNode, cpNode];

	/* The failed flag is set if a 2-prong cannot be found. This occurs
	 * when the 2 points are too close together and the 2-prong 
	 * becomes, in the limit, a 1-prong. We do not want these 2-prongs
	 * as they push the floating point precision limits when finding
	 * their circle center causing too much inaccuracy. Of course, our
	 * entire algorithm's precision is limited by floating point 
	 * doubles.
	 */
	let failed = false;
	
	/* 
	 * The shortest distance so far between the first contact point and
	 * the circle center - we require this to get shorter on each 
	 * iteration as convergence occurs. If it does not, oscillation
	 * of the algorithm has occured due to floating point inaccuracy
	 * and the algorithm must terminate.
	 */
	let shortestSquaredDistance = Number.POSITIVE_INFINITY;
	
	let pos = cpNode.item.pointOnShape;
	let bezierNode = pos.bezierNode;
	let t = pos.t;
	
	let x = cpNode.item.matCircle.circle.center;
	let bezierPieces = Geometry.getBoundaryPieceBeziers(shape, δ);
	let xs; // Trace the convergence.
	let z;
	let squaredError;
	//
	//let slog = _debug_.twoProngs.length === 16;
	let i=0;
	/*if (slog) { 
		console.log('a')
	}*/
	//
	do {
		//
		i++
		//
		let r = Vector.squaredDistanceBetween(x, y);
		bezierPieces = cullBezierPieces(bezierPieces, x, r, _debug_);
		
		z = getClosestBoundaryPointToPoint(
			bezierPieces,
			x,
			y,
			bezierNode, 
			t,
			_debug_/*,
			slog && i > 3*/
		);
		
		//if (_debug_) { xs = xs || []; xs.push({ x, y, z, t });	}
		
		let squaredChordDistance = Vector.squaredDistanceBetween(y,z);
		
		//if (slog) { console.log('sqd: ' + squaredChordDistance); }
		
		if (squaredChordDistance <= SQUARED_SEPERATION_TOLERANCE) {
			failed = true;
			//console.log(_debug_.twoProngs.length);
			break;
		} 

		
		/*
		 * Find the point on the line connecting y with x that is  
		 * equidistant from y and z. This will be our next x.
		 */
		let nextX = findEquidistantPointOnLine(x,y,z);
		
		squaredError = Vector.squaredDistanceBetween(x, nextX);
		
		/*
		 * Prevent oscillation of calculated x (due to floating point
		 * inaccuracies). See comment above decleration of 
		 * shortestSquaredDistance.
		 */
		let squaredDistance = Vector.squaredDistanceBetween(y, nextX);
		if (squaredDistance < shortestSquaredDistance) {
			shortestSquaredDistance = squaredDistance;
		} else {
			//failed = true;
			//break;
		}
		
		x = nextX;
		
		if (_debug_) { xs = xs || []; xs.push({ x, y, z, t });	}
	} while (squaredError > SQUARED_ERROR_TOLERANCE && i < MAX_ITERATIONS);
	
	if (i === MAX_ITERATIONS) {
		// This is simply a case of convergence being too slow. The
		// gecko, for example, takes a max of 21 iterations.
		failed = true;
	}
	

	let circle = new Circle(
			x,
			Vector.distanceBetween(x,z)
	);
	 

	if (_debug_) { recordForDebugging(_debug_, failed, cpNode, circle, y,z, δ, xs); }
	
	
	if (failed) {
		// Remove failed point.
		LinkedLoop.remove(shape.contactPoints, cpNode);
		return undefined;
	} 
	
	
	PointOnShape.setPointOrder(shape, circle, z, _debug_);
	return { circle, z };
}


function recordForDebugging(
		_debug_, failed, cpNode, circle, y,z, δ, xs) {
	
	// This is a medial axis point.
	if (failed) {
		//_debug_.draw.dot(cpNode.item, 0.6, 'black');
		_debug_.draw.dot(cpNode.item, 1, 'black');
		_debug_.draw.dot(cpNode.item, 0.1, 'yellow');
		//_debug_.draw.dot(cpNode.item, 0.01, 'black');
		//_debug_.draw.dot(cpNode.item, 0.001, 'yellow');
		//_debug_.draw.dot(cpNode.item, 0.0001, 'black');
	} else {
		_debug_.draw.dot(circle.center, 0.5, 'yellow'); 
		if (_debug_.drawStuff) {
			_debug_.draw.circle(circle, 'red thin2 nofill');
			_debug_.draw.dot(cpNode.item, 0.55, 'red'); 
			_debug_.draw.dot(z, 0.7, 'red');
		}
	}
	
	_debug_.twoProngs.push({
		twoProng: cpNode,
		δ,
		y,
		x: circle.center, 
		xs,
		failed,
	});	
}


/**
 * Cull all bezierPieces not within given radius of a given point.
 * 
 * @param {BezierPieces} bezierPieces
 * @param {[Number]} p
 * @param {Number} r
 * @returns
 */
function cullBezierPieces(bezierPieces, p, rSquared, _debug_) {
	const CULL_THRESHOLD = 5;
	
	if (bezierPieces.length <= CULL_THRESHOLD) {
		return bezierPieces;
	}
	

	let newPieces = [];
	for (let bezierPiece of bezierPieces) {
		let bezier = bezierPiece.bezierNode.item;
		
		let rect = bezier.getBoundingBox();
		let bd = Geometry.getClosestSquareDistanceToRect(
				rect,
				p
		);
		if (bd <= rSquared) {
			newPieces.push(bezierPiece);
		} 
	}
	
	return newPieces;
}


/**
 * 
 * @param x
 * @param y
 * @param z
 * @returns The point on the line from y to x that is equidistant from
 *          y and z. 
 *          
 * Notes: It is important that this function is numerically stable,
 * but this has not been investigated properly yet.
 */
function findEquidistantPointOnLine(x,y,z) {
	// Some basic algebra (not shown) finds the required point.
	
	// Swap axis if x and y are more aligned to y-axis than to x-axis.
	let swapAxes = 
		Math.abs((x[1] - y[1]) / (x[0] - y[0])) > 1;
	
	// Cache
	let x1, x2, y1, y2, z1, z2;
	
	if (swapAxes) {
		x1 = x[1];	x2 = x[0];
		y1 = y[1];	y2 = y[0];
		z1 = z[1];	z2 = z[0];	
	} else {
		x1 = x[0];	x2 = x[1];
		y1 = y[0];	y2 = y[1];
		z1 = z[0];	z2 = z[1];
	}
	
	// a <= 1 (due to swapped axes)
	let a = (x2 - y2) / (x1 - y1); 
	let b = y2 - a*y1;
	let c = (y1*y1 + y2*y2 - z1*z1 - z2*z2) + 2*b*(z2 - y2);
	let d = y1 - z1 + a*(y2 - z2);
	let t1 = c/(2*d);
	let t2 = a*t1 + b;
	
	return swapAxes ? [t2,t1] : [t1,t2];
}


module.exports = find2Prong;


// 318