'use strict'

let Util         = require('../utils.js');
let Poly         = require('../polynomial/polynomial.js');
let Memoize      = require('../memoize.js');
let Vector       = require('../vector/vector.js');

let Circle       = require('./classes/circle.js');
let Shape        = require('./classes/shape.js');
let Arc          = require('./classes/arc.js');
let PointOnShape = require('./classes/point-on-shape.js');
let Bezier       = require('./classes/bezier.js');


/*
 * Geometry utility functions
 */
let Geometry = {};


/**
 * Get line shape intersection points.
 * 
 * @param line A simple line described by two points, e.g. [[p0x,p0y],[p1x,p1y]]
 * @param shape {Shape} 
 * @param δ Curve segment described by start and end contact points
 *
 * Currently not used
 */
Geometry.getLineShapeIntersectionPoints = function(line, shape, δ) {
	
	let points = [];
	let bezierPieces = Shape.getBoundaryPieceBeziers(δ);
	
	for (let i=0; i<bezierPieces.length; i++) {
		bezierPiece = bezierPieces[i];
		
		let bezier = bezierPiece.bezierNode.item;
		let iPoints = Geometry.getLineBezierIntersectionPoints(
				line, 
				bezier, 
				bezierPiece.tRange
		);
		
		for (let j=0; j<iPoints.length; j++) {
			points.push(iPoints[j].p);
		}
	}
	
	return points;
}


/**
 * @description
 */
Geometry.closestSquaredDistanceToRotatedRect = function(bezier, p) {
	let tightBoundingBox = Bezier.getBoundingBoxTight(bezier);
	
	let ds = [0,1,2,3].map(function(i) {
		return Vector.squaredDistanceBetweenPointAndLineSegment(
				p, 
				[tightBoundingBox[i], tightBoundingBox[(i+1) % 4]]
		);				
	});
	
	return Util.min(ds);
}


/**
 * @description
 */
Geometry.getClosestSquareDistanceToRect = function(box, p) {

	let x0 = box[0][0];
	let y0 = box[0][1];
	let x1 = box[1][0];
	let y1 = box[1][1];
	
	let xp = p[0];
	let yp = p[1];
	
	if (xp < x0) {
		if (yp < y0) {
			return Vector.squaredDistanceBetween(box[0], p);
		} else if (yp > y1) {
			return Vector.squaredDistanceBetween([x0,y1], p);
		} else {
			let d = x0 - xp;
			return d*d;
		}
	} else if (xp > x1) {
		if (yp < y0) {
			return Vector.squaredDistanceBetween([x1,y0], p);
		} else if (yp > y1) {
			return Vector.squaredDistanceBetween(box[1], p);
		} else {
			let d = xp - x1;
			return d*d;
		}
	} else {
		if (yp < y0) {
			let d = y0 - yp;
			return d*d;
		} else if (yp > y1) {
			let d = yp - y1;
			return d*d;
		} else {
			return 0;
		}
	}
}


/**
 * @description
 */
Geometry.degAngleFromSinCos = function(sinθ, cosθ) {

	function toDeg(θ) {
		return θ * (180/Math.PI);
	}
	
	if (cosθ === 0) {
		if (sinθ > 0) { return 90; }
		return 270;
	}
	if (cosθ > 0) {
		return toDeg(Math.atan(sinθ / cosθ));
	}
	return 180 + toDeg(Math.atan(sinθ / cosθ));
}



/** 
 * @returns A directional arc from 3 ordered points. 
 */
Geometry.arcFrom3Points = function(ps) {
	let midPoint1 = Vector.mean([ps[0], ps[1]]);   
	let midPoint2 = Vector.mean([ps[1], ps[2]]);
	
	let chord1 = Vector.fromTo(ps[0], ps[1]); 
	let chord2 = Vector.fromTo(ps[1], ps[2]);
	
	let perpendicular1 = [chord1[1], -chord1[0]];   
	let perpendicular2 = [chord2[1], -chord2[0]];
	
	let l1 = [midPoint1, Vector.translate(perpendicular1, midPoint1)];
	let l2 = [midPoint2, Vector.translate(perpendicular2, midPoint2)];
	
	let circleCenter = Geometry.lineLineIntersection(l1, l2);

	let arc;
	if (circleCenter === null) { 
		// The circle is in effect a line segment.
		if (Vector.equal(ps[0], ps[2])) {
			return null;
		}
		arc = new Arc(null, ps[0], ps[2]);
		return arc;
	} 
	
	let sideVector1 = Vector.fromTo(circleCenter, ps[0]);
	let midVector   = Vector.fromTo(circleCenter, ps[1]);
	let sideVector2 = Vector.fromTo(circleCenter, ps[2]);
	let radius = Vector.length(sideVector1);
	let sinθ1   = -sideVector1[1] / radius; 
	let cosθ1   =  sideVector1[0] / radius;
	let sinθ2   = -sideVector2[1] / radius; 
	let cosθ2   =  sideVector2[0] / radius;
	let sin_midangle = -midVector  [1] / radius; 
	let cos_midangle =  midVector  [0] / radius;
	
	if (Geometry.isAngleBetween(sin_midangle, cos_midangle, sinθ1, cosθ1, sinθ2, cosθ2)) {
		arc = new Arc(
			new Circle(circleCenter, radius), 
			ps[0], ps[2], 
			sinθ1, cosθ1, sinθ2, cosθ2
		);
	} else {
		arc = new Arc(
			new Circle(circleCenter, radius), 
			ps[2], ps[0], 
			sinθ2, cosθ2, sinθ1, cosθ1
		);				
	}
	
	return arc;
}


/**
 * @description
 */
Geometry.quadrant = function(sinθ, cosθ) {
	if (sinθ >= 0) { 
		if (cosθ >= 0) { return 1; } 
		return 2;
	}
	if (cosθ >= 0) { return 4; }
	return 3;
}


/**
 * @description
 */
Geometry.isAngle1LargerOrEqual = function(sinθ1, cosθ1, sinθ2, cosθ2) {
	let q1 = Geometry.quadrant(sinθ1, cosθ1); 
	let q2 = Geometry.quadrant(sinθ2, cosθ2);
	
	if (q1 > q2) { return true; }
	if (q1 < q2) { return false; }
	
	// Same quadrant
	if (q1 === 1 || q1 === 4) { 
		return sinθ1 >= sinθ2;
	}
	return sinθ1 <= sinθ2;
}


/** 
 * Returns true if angle1 < angle < angle2 in the non-trivial sense.
 */ 
Geometry.isAngleBetween = function(
		sinθ, cosθ, sinθ1, cosθ1, sinθ2, cosθ2) {
	
	let θ1_larger_θ2 = Geometry.isAngle1LargerOrEqual(
			sinθ1, cosθ1, sinθ2, cosθ2);
	
	let θ_larger_θ2  = Geometry.isAngle1LargerOrEqual(
			sinθ, cosθ, sinθ2, cosθ2);
	
	let θ_larger_θ1  = Geometry.isAngle1LargerOrEqual(
			sinθ, cosθ, sinθ1, cosθ1);
	

	return θ1_larger_θ2 
		? (θ_larger_θ1 || (!θ_larger_θ2))
		: (θ_larger_θ1 && (!θ_larger_θ2));
}


/**
 * Find point where two lines intersect.
 *  
 * @param line1 The first line - given as 2 points 
 * @param line2 The first line - given as 2 points
 * @returns Point where two lines intersect or null if they don't 
 * intersect or intersect everywhere. 
 */ 
Geometry.lineLineIntersection = function(line1, line2) {

	let [[p1x, p1y], [p2x, p2y]] = line1; 
	let [[p3x, p3y], [p4x, p4y]] = line2;
	
	let v1x = p2x - p1x;
	let v1y = p2y - p1y;
	let v2x = p4x - p3x;
	let v2y = p4y - p3y;
	
	let cross = v2x*v1y - v2y*v1x;
	if (cross === 0) {
		// parallel
		return undefined;
	} 
	
	let b = ((p3y-p1y)*v1x - (p3x-p1x)*v1y) / cross;	
	
	return [p3x + b*v2x, p3y + b*v2y];
}


/**
 * @description
 */
Geometry.lineThroughPointAtRightAngleTo = function(p, v) {
	let u = [-v[1], v[0]];
	let p20 = p[0] + u[0];
	let p21 = p[1] + u[1];
	
	return [p, [p20,p21]];
}


/**
 * @description Get all intersection points between a line and a bezier 
 * within a certain t range.
 * 
 * @returns An array of { p, t } 
 */
Geometry.getLineBezierIntersectionPoints = function(
		line, bezier, tRange) {
	
	let t = [-line[0][0], -line[0][1]];
	let p = [
	    line[1][0] + t[0],
	    line[1][1] + t[1],
	];
	
	
	// Cache
	let lineLength = Vector.length(p); 
	let sinθ = -p[1] / lineLength;
	let cosθ = p[0] / lineLength;
	

	let bezierPoints = Vector.translateThenRotatePoints(
			bezier.bezierPoints, t, sinθ, cosθ
	);
	
	let newBezier = new Bezier(bezierPoints);
	
	let roots = Poly.findCubicRoots01(newBezier.y);
	
	return roots.map( 
			t => ({ p: Bezier.evaluate(bezier)(t), t })
	);
}


module.exports = Geometry;
