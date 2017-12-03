(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');

let Vector = require('../../vector/vector.js');
let Memoize = require('../../memoize.js');

let Bezier = require('./bezier.js');
let Circle = require('./circle.js');


/** 
 * @constructor 	
 * 	
 * @param p {number[]} - The point coordinates.
 * @param {ListNode} bezierNode	
 * @param t
 * @param type {MAT_CONSTANTS.pointType} 	
 *  'standard' : 0, // Not special,   	
 *  'sharp'    : 1, // Sharp corner, 	
 *  'dull'     : 2, // dull corner, 	
 * @param {Number} order - For dull corners only; equals the cross of
 * 		  the tangents at the corner interface to impose an order on
 * 		  points with the same point coordinates and t values.   
 * @param {Number} order2 - For points of hole closing 2-prongs only;
 *		  these points are duplicated to split the shape so they need
 *        to be ordered appropriately. 
 * @param {Circle} circle - The osculating circle at this point pointing
 * towards the inside of the shape.
 */	
function PointOnShape(
		bezierNode, t, type, order, order2) {

	this.bezierNode = bezierNode; 	
	this.t          = t;	
	this.type       = type;	
	this.order      = order; 
	this.order2     = order2;
	
	//---- Cache
	let p = Bezier.evaluate(bezierNode.item)(t);
	this.p = p;
	// Removing this cache will help in that if {PointOnShape} is 
	// called as a parameter (where a point is required) it will more 
	// likely result in monomorphic behaviour as opposed to polymorphic 
	// or megamorphic.
	this[0] = p[0];
	this[1] = p[1];
}	
	

PointOnShape.getOsculatingCircle = Memoize.m1(function(pos) {
	if (pos.type === MAT_CONSTANTS.pointType.sharp) {
		return new Circle(pos.p, 0);
	} else if (pos.type === MAT_CONSTANTS.pointType.extreme) {
		let r = MAT_CONSTANTS.maxOsculatingCircleRadius;
		let p = [pos.p[0], pos.p[1] - r];
		return new Circle(p, r);
	}
	return calcOsculatingCircle(
			pos.bezierNode.item, 
			pos.t
	); 
});


/**
 * @description Calculates the osculating circle of the bezier at a 
 * specific t. If it is found to have negative or nearly zero radius
 * it is clipped to have positive radius so it can point into the shape.
 * @param bezier
 * @param t
 * @returns {Circle}
 */
function calcOsculatingCircle(bezier, t) {	
	let κ = -Bezier.κ(bezier)(t); 

	// If (κ > 0) { Bending inwards. }
	
	let radius;
	if (κ <= 1/MAT_CONSTANTS.maxOsculatingCircleRadius) { 
		// Curving wrong way (or flat, or too big), but probably a 
		// significant point to put a 2-prong.
		radius = MAT_CONSTANTS.maxOsculatingCircleRadius;
	} else {
		radius = Math.min(
				1/κ, 
				MAT_CONSTANTS.maxOsculatingCircleRadius
		);
	}
	
	let normal = Bezier.normal(bezier)(t);
	let p = Bezier.evaluate(bezier)(t);
	let circleCenter = [
		p[0] + normal[0]*radius, 
		p[1] + normal[1]*radius
	];

	return new Circle(circleCenter, radius);
}


/**
 * @description Compares two PointOnShapes according to its position on
 * the bezier loop.
 */
PointOnShape.compare = function(a,b) {
	if (a === undefined || b === undefined) {
		return undefined;
	}
	
	let res;
	
	res = a.bezierNode.item.indx - b.bezierNode.item.indx;
	if (res !== 0) { return res; }

	res = a.t - b.t;
	if (res !== 0) { return res; }

	res = a.order - b.order;
	if (res !== 0) { return res; }
	
	res = a.order2 - b.order2;
	
	return res;
}


/**
 * @description Returns true if its osculation circle is pointing 
 * straight upwards. 
 */
PointOnShape.isPointingStraightUp = function(pos) {
	let circle = PointOnShape.getOsculatingCircle(pos); 
	if (!circle) { return false; }
	
	let circleDirection = Vector.toUnitVector(
			Vector.fromTo(pos, circle.center)
	);
	
	// If not almost pointing straight up
	if (Math.abs(circleDirection[0]) > 1e-6 || 
		circleDirection[1] > 0) {
		
		return false;
	}
	
	return true;
}


function dullCornerAt(shape, p) {
	let dullCornerHash = shape.dullCornerHash;
	let key = PointOnShape.makeSimpleKey(p); 
	
	return dullCornerHash[key] || null;
}


/**
 * @description Sets the order (to distinguish between points lying on top of each 
 * other) of the contact point if it is a dull corner.
 * @param {PointOnShape} pos
 * @note Modifies pos
 */
PointOnShape.setPointOrder = function(shape, circle, pos) {
	
	let dullCorner = dullCornerAt(shape, pos);
	
	if (!dullCorner) { return; }
	
	let bezier = dullCorner.beziers[0];
	let tan1pre = Bezier.tangent(bezier)(1);
	
	let tan1 = [tan1pre[1], -tan1pre[0]]; // rotate by -90 degrees
	let tan2 = Vector.toUnitVector(
			Vector.fromTo(pos, circle.center)
	);
	
	pos.order = -Vector.dot(tan1, tan2);
	
	return pos.order;
}


/**
 * @description Clones the PointOnShape.
 */
PointOnShape.copy = function(pos) {
	return new PointOnShape(	
			pos.bezierNode, 
			pos.t, 
			pos.type, 
			pos.order, 
			pos.order2 
	);
}


/**
 * @description Creates a string key that only depends on the 
 * PointOnShape's coordinates.
 */
PointOnShape.makeSimpleKey = function(p) {	
	return '' + p[0] + ', ' + p[1]; 		
}


/**
 * @description Returns the PointOnShape type as a human-readable 
 * string.
 * @param {number} type
 * @returns {string}
 */
function typeToStr(type) {
	for (let key in MAT_CONSTANTS.pointType) {
		if (MAT_CONSTANTS.pointType[key] === type) {
			return key;
		}
	}
}


/**
 * @description Returns a human-readable string of the PointOnShape.
 * @note For debugging only.
 */
PointOnShape.toHumanString = function(pos) {
	return '' + pos[0] + ', ' + pos[1] + 
		   ' | bz: '   + pos.bezierNode.item.indx + 
		   ' | t: '    + pos.t + 
		   ' | ord: '  + pos.order + 
		   ' | ord2: ' + pos.order2 + ' | ' +
		   typeToStr(pos.type);
}


module.exports = PointOnShape;

},{"../../mat-constants.js":16,"../../memoize.js":36,"../../vector/vector.js":43,"./bezier.js":4,"./circle.js":5}],2:[function(require,module,exports){
'use strict'

/** 
 * @constructor
 * @description Arc class.
 * If circle === null then the arc degenerates into a line segment 
 * given by sinAngle1 and cosAngle2 which now represent points.
 * The arc curve is always defined as the piece from angle1 -> angle2.
 * Note: startpoint and endpoint is redundant 
 */
function Arc(
		circle, 
		sinAngle1, cosAngle1, 
		sinAngle2, cosAngle2,
		startpoint, endpoint) {
	
	// Intrinsic
	this.circle = circle;
	this.sinAngle1 = sinAngle1;
	this.sinAngle2 = sinAngle2;
	this.cosAngle1 = cosAngle1;
	this.cosAngle2 = cosAngle2;
	
	// Cache
	this.startpoint = startpoint; // Redundant but useful
	this.endpoint   = endpoint;	  // Redundant but useful
}
	

/** 
 * @private
 * @description Returns the closest point on the arc.
 * @returns {Object}  
 * 
 * NOTE: Not currently used. 
 */
Arc.closestPointOnArc = function(p, arc) {
	if (arc.circle !== null) { // else the arc is degenerate into a line
		// First move arc circle onto origin
		var x = arc.circle.center[0];
		var y = arc.circle.center[1];
		
		var arco = new Arc(
			new Circle([0,0], arc.circle.radius), 
			Vector.translate(arc.startpoint,[-x,-y]), 
			Vector.translate(arc.endpoint,[-x,-y]),
			arc.sinAngle1, 
			arc.cosAngle1, 
			arc.sinAngle2, 
			arc.cosAngle2
		);
		
		var pp = Vector.translate(p, [-x,-y]);
		var l = Vector.length(pp);
		var sin_pp = -pp[1] / l; 			
		var cos_pp = pp[0] / l;
		
		if (Geometry.isAngleBetween(
				sin_pp, cos_pp, 
				arco.sinAngle1, arco.cosAngle1, 
				arco.sinAngle2, arco.cosAngle2)) {
			var r_o_l = arco.circle.radius;
			var res = { p: Vector.translate([r_o_l * cos_pp, r_o_l * -sin_pp], [x,y]), position: 0 };
			
			return res;
		} else {
			var asp = arc.startpoint;
			var aep = arc.endpoint;
			
			var d1 = Vector.distanceBetween(asp, p);
			var d2 = Vector.distanceBetween(aep, p);
			
			if (d1 < d2) { return { p: asp, position: 1 }; }
			
			return { p: aep, position: 2 };
		}
	}
	
	// Line degenerate case - this is exactly a routine for 
	// distance (and closest point) between point and line segment.
	var asp = arc.startpoint;
	var aep = arc.endpoint;

	var d1 = Vector.distanceBetween(asp, p);
	var d2 = Vector.distanceBetween(aep, p);
	var ds = Math.sqrt(Vector.distanceBetweenPointAndLineSegment(p, [asp, aep]));
	
	if (d1 <= d2 && d1 <= ds) { 
		return { p: asp, position: 1 }; 
	} else if (d2 <= d1 && d2 <= ds) { 
		return { p: aep, position: 2 }; 
	}
	
	// else ds is shortest
	var v = Vector.fromTo(asp,aep);
	
	
	var l1p2 = [p[0] + v[1], p[1] + -v[0]];
	var res = { 
		p: Geometry.lineLineIntersection([p, l1p2], [asp, aep]), 
		position: 0, 
	};

	return res; 
}


module.exports = Arc;

},{}],3:[function(require,module,exports){
'use strict'

/**
 * @constructor
 * @param bezierNode
 * @param tRange
 */
function BezierPiece(bezierNode, tRange) {
	this.bezierNode = bezierNode;
	this.tRange = tRange;
}


module.exports = BezierPiece;

},{}],4:[function(require,module,exports){
'use strict'

let Util            = require('../../util.js');
let Poly            = require('../../polynomial/polynomial.js');
let Vector          = require('../../vector/vector.js');
let Memoize         = require('../../memoize.js');

let gaussQuadrature = require('../../numerical/functions/gaussian-quadrature.js');


/**
 * @description Representation of a 3rd degree (i.e. cubic) bezier, 
 * possibly in the context of a shape.
 * @param {number[][]} bezierPoints
 * @param {number} indx
 * @example
 * 		let bezier = new Bezier([0,0],[1,1],[2,1],[3,0]);
 */
function Bezier(bezierPoints, indx) {
	
	this.indx = indx; 
	this.bezierPoints = bezierPoints;
	
	//---- Bernstein basis representation
	let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = bezierPoints;
	
	
	//---- Power basis representation
	this.x = [
	    x3 - 3*x2 + 3*x1 - x0, // t^3
	    3*x2 - 6*x1 + 3*x0,    // t^2
	    3*x1 - 3*x0,           // t^1
	    x0,                    // t^0
	];
	this.y = [
	    y3 - 3*y2 + 3*y1 - y0, // t^3
	    3*y2 - 6*y1 + 3*y0,    // t^2
	    3*y1 - 3*y0,           // t^1
	    y0,                    // t^0
	];
	
	this.dx   = Poly.differentiate(this.x);   // Polynomial in t
	this.dy   = Poly.differentiate(this.y);   // ...
	this.ddx  = Poly.differentiate(this.dx);  // ...
	this.ddy  = Poly.differentiate(this.dy);  // ...
	this.dddx = Poly.differentiate(this.ddx); // ...
	this.dddy = Poly.differentiate(this.ddy); // ...
}


/** 
 * @description Evaluates the bezier parametric equation at t. 
 * @param t {number} - The point where the evaluation should take place. 
 * 
 * @returns {number[]}
 **/
Bezier.evaluate = Memoize.m1(function(bezier) {
	let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = bezier.bezierPoints;
	
	return function(t) {
		if (t === 0) {
			return [x0, y0];
		} else if (t === 1) {
			return [x3, y3];
		}
		
		return [
			Bezier.evaluateX(bezier)(t),
			Bezier.evaluateY(bezier)(t)
		];		
	}
});


/**
 * @descrpiption Returns the curvature, κ, at a specific t. 
 */
Bezier.κ = Memoize.m1(function(bezier) {
	return function(t) {
		let dx  = Bezier.evaluateDx (bezier)(t); 
		let dy  = Bezier.evaluateDy (bezier)(t);
		let ddx = Bezier.evaluateDdx(bezier)(t);
		let ddy = Bezier.evaluateDdy(bezier)(t);
		
		let numer = dx*ddy - dy*ddx;
		let d = dx*dx + dy*dy;
		let denom = Math.sqrt(d*d*d);
		return numer / denom; 	
	}
});


/**
 *
 */
let κTimesSDiff = Memoize.m1(function(bezier) {
	return function(t) {
		let dx    = Bezier.evaluateDx (bezier)(t); 
		let dy    = Bezier.evaluateDy (bezier)(t);
		let ddx   = Bezier.evaluateDdx(bezier)(t);
		let ddy   = Bezier.evaluateDdy(bezier)(t);
		
		let numer = dx*ddy - dy*ddx;
		let denom = dx*dx + dy*dy;
		
		return numer / denom;
	}
});


/** 
 * @description A modified version of differential of κ (use quotient 
 * rule, ignore denominator and multiply by 2/3). We need to find the 
 * zeros of this function to get the min/max curvature.
 * 
 * NOTE: Math is from http://math.info/Calculus/Curvature_Parametric/
**/
Bezier.dκ = Memoize.m1(function(bezier) {
	let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = bezier.bezierPoints;
	
	return function(t) {
		
		let ts = t*t;
		let omt = 1-t; 
		
		let a = ts*x3;
		let i = ts*y3;
		let b = 2*t - 3*ts;
		let c = (3*t-1)*omt;
		let d = omt*omt;
		let e = 3 * (a+b*x2-c*x1-d*x0);
		let f = 3 * (i+b*y2-c*y1-d*y0);
		let g = 6 * (t*y3-(3*t-1)*y2 + (3*t-2)*y1 + omt*y0); 
		let h = 6 * (t*x3-(3*t-1)*x2 + (3*t-2)*x1 + omt*x0);

		return 4*(e*(y3-3*y2+3*y1-y0) - 
			  f*(x3-3*x2+3*x1-x0)) * Math.pow((f*f+e*e), (3/2)) - 
			  (e*g-h*f)*(2*g*f+2*h*e) * Math.sqrt(f*f+e*e);		
	}
});


/**
 * @description Returns the tangent of the bezier at a specific t.
 */
Bezier.tangent = Memoize.m1(function(bezier) {
	return function(t) {
		let dx = Bezier.evaluateDx(bezier)(t);
		let dy = Bezier.evaluateDy(bezier)(t);
		let d = Math.sqrt(dx*dx + dy*dy);

		return [dx/d, dy/d];
	}
});


/**
 * @description Returns the normal of the bezier at a specific t.
 */
Bezier.normal = Memoize.m1(function(bezier) {
	return function(t) {
		let tan = Bezier.tangent(bezier)(t);
		return [tan[1], -tan[0]];
	}
});


/**
 * @description Returns the total curvature of the bezier in [0,1].
 */
Bezier.getTotalCurvature = Memoize.m1(
		bezier => gaussQuadrature(κTimesSDiff(bezier), [0,1])
);


/**
 * @description Returns the total absolute curvature of the bezier.
 * @param {number[]} interval_
 * @returns {number} The result in radians.
 */
Bezier.getTotalAbsoluteCurvature = Memoize.m1(function(bezier) {
	let totalAbsoluteCurvature = {}; // Lookup cache
	
	return function(interval_) {
		let interval = interval_ || [0,1];
		
		let key = '' + interval[0] + ', ' + interval[1]; 
		if (totalAbsoluteCurvature[key]) { 
			return totalAbsoluteCurvature[key]; 
		}
		
		// Numerically integrate the absolute curvature
		let result = gaussQuadrature(
				t => Math.abs(κTimesSDiff(bezier)(t)),
				interval
		);
		totalAbsoluteCurvature[key] = result;
		
		return result;		
	}
});


/**
 * @descrpiption Returns the total curve length.
 */
Bezier.getCurveLength = Memoize.m1(
		bezier => gaussQuadrature(Bezier.ds(bezier), [0,1])
);


/**
 * @descrpiption Returns the differential of length at t.
 */
Bezier.ds = Memoize.m1(function(bezier) {
	return function(t) {
		let dx = Bezier.evaluateDx(bezier)(t);
		let dy = Bezier.evaluateDy(bezier)(t);
		
		return Math.sqrt(dx*dx + dy*dy);	
	}
});


Bezier.evaluateX    = Memoize.m1(bezier => Poly.evaluate(bezier.x   ));
Bezier.evaluateY    = Memoize.m1(bezier => Poly.evaluate(bezier.y   ));
Bezier.evaluateDx   = Memoize.m1(bezier => Poly.evaluate(bezier.dx  ));
Bezier.evaluateDy   = Memoize.m1(bezier => Poly.evaluate(bezier.dy  ));
Bezier.evaluateDdx  = Memoize.m1(bezier => Poly.evaluate(bezier.ddx ));
Bezier.evaluateDdy  = Memoize.m1(bezier => Poly.evaluate(bezier.ddy ));
Bezier.evaluateDddx = Memoize.m1(bezier => Poly.evaluate(bezier.dddx));
Bezier.evaluateDddy = Memoize.m1(bezier => Poly.evaluate(bezier.dddy));


/**
 * @description Returns the bounding box of the normalized (i.e. first
 * point moved to origin and rotated so that last point lies on x-axis)
 * bezier.
 * @param {number[][]} bezierPoints
 * @param {number} sinAngle - Sine of angle made by line from first 
 * bezier point to last with x-axis.
 * @param {number} cosAngle - Cosine of angle made by line from first 
 * bezier point to last with x-axis.
 * @returns {number[][]} Bounding box in the form
 * [[minx, miny], [maxx,maxy]
 */
function getNormalizedBoundingBox(bezierPoints, sinAngle, cosAngle) {
	let vectorToOrigin = Vector.transform(bezierPoints[0], x => -x);
	
	let normalizedBezier = new Bezier(
		Vector.translateThenRotatePoints(
				bezierPoints, 
				vectorToOrigin, 
				-sinAngle, 
				cosAngle
		)
	);
	
	return Bezier.getBoundingBox(normalizedBezier);
}


/**
 * @description Returns tight bounding box of bezier.
 * @returns {number[][]} The tight bounding box of the bezier as four
 * points of a rotated rectangle.
 */
Bezier.getBoundingBoxTight = Memoize.m1(function(bezier) {
	let bezierPoints = bezier.bezierPoints;
	let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = bezierPoints;
	
	let straightLength = Math.sqrt((x3-x0)*(x3-x0) + (y3-y0)*(y3-y0));
	let sinAngle = (y3-y0) / straightLength; 
	let cosAngle = (x3-x0) / straightLength;
	
	let box = getNormalizedBoundingBox(
			bezierPoints, sinAngle, cosAngle
	);
	
	let p0x = box[0][0];
	let p0y = box[0][1];
	let p1x = box[1][0];
	let p1y = box[1][1];

	let axisAlignedBox = [ 
		box[0], [p1x, p0y],
		box[1], [p0x, p1y]
	];

	return Vector.rotateThenTranslatePoints(
			axisAlignedBox, 
			bezierPoints[0], 
			sinAngle, 
			cosAngle
	); 
});


/**
 * @description Calculates and returns general bezier bounds.
 * @returns {Object} The axis-aligned bounding box together with the t values
 * where the bounds on the bezier are reached.
 */
Bezier.getBounds = Memoize.m1(function(bezier) {
	
	// Roots of derivative
	let roots = [bezier.dx, bezier.dy].map(Poly.findQuadraticRoots01);
	
	// Endpoints
	roots[0].push(0, 1); 
	roots[1].push(0, 1);
	
	let minX = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	
	let tMinX = undefined;
	let tMinY = undefined;
	let tMaxX = undefined;
	let tMaxY = undefined;

	// Test points
	for (let i=0; i<roots[0].length; i++) {
		let t = roots[0][i];
		let x = Bezier.evaluateX(bezier)(t);
		if (x < minX) { minX = x;  tMinX = t; }
		if (x > maxX) { maxX = x;  tMaxX = t; }
	}
	for (let i=0; i<roots[1].length; i++) {
		let t = roots[1][i]; 
		let y = Bezier.evaluateY(bezier)(t);  
		if (y < minY) { minY = y;  tMinY = t; }
		if (y > maxY) { maxY = y;  tMaxY = t; }
	}
	
	let ts  = [[tMinX, tMinY], [tMaxX, tMaxY]];
	let box = [[minX,  minY ], [maxX,  maxY ]];
	
	return { ts, box };
});


/**
 * @description Returns the axis-aligned bounding box of a given bezier.
 * @returns {number[][]} the axis-aligned bounding box in the form
 * [[minx, miny], [maxx,maxy]
 */
Bezier.getBoundingBox = Memoize.m1(function(bezier) {
	return Bezier.getBounds(bezier).box;
});


/**
 * @description Find the intersection points of the two beziers.
 * @returns {number[][]} A list of points.
 */
Bezier.findIntersection = function(bezier1, bezier2) {
	let bezier1Points = bezier1.bezierPoints;
	let bezier2Points = bezier2.bezierPoints;
	let [[x10, y10], [x11, y11], [x12, y12], [x13, y13]] = bezier1Points;
	let [[x20, y20], [x21, y21], [x22, y22], [x23, y23]] = bezier1Points;
	
	// TODO - finish
};


/**
 * Reterns 2 new beziers split at t, i.e. for the ranges 
 * [0,t] and [t,1]. Uses de Casteljau's algorithm. 
 */
Bezier.splitAt = function(bezier, t) {
	let bezierPoints = bezier.bezierPoints; 
	let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = bezierPoints; 
		
	let s = 1 - t;
	let t2 = t * t;
	let t3 = t2 * t;
	let s2 = s * s;
	let s3 = s2 * s;
	
	let part1 = [
		[x0, y0],
		[t*x1 + s*x0, t*y1 + s*y0],
		[t2*x2 + 2*s*t*x1 + s2*x0, t2*y2 + 2*s*t*y1 + s2*y0],
		[t3*x3 + 3*s*t2*x2 + 3*s2*t*x1 + s3*x0, 
		 t3*y3 + 3*s*t2*y2 + 3*s2*t*y1 + s3*y0]
	];
	
	let part2 = [
		part1[3],
		[t2*x3 + 2*t*s*x2 + s2*x1, t2*y3 + 2*t*s*y2 + s2*y1],
		[t*x3 + s*x2, t*y3 + s*y2],
		[x3, y3]
	];
	
	return [new Bezier(part1), new Bezier(part2)];
}


module.exports = Bezier;

},{"../../memoize.js":36,"../../numerical/functions/gaussian-quadrature.js":37,"../../polynomial/polynomial.js":39,"../../util.js":42,"../../vector/vector.js":43}],5:[function(require,module,exports){
'use strict'

let Vector = require('../../vector/vector.js');


/** 
 * @constructor
 * @description Circle class.
 * @param {number[]} center
 * @param {number} radius 
 */
function Circle(center, radius) {
	this.center = center;
	this.radius = radius;
}


/**
 * @description Returns a scaled version of the given circle without
 * changing its center position.
 * @param {Circle} circle
 * @param {number} s Scale multiplier
 * @returns {Circle} The scaled circle.
 */
Circle.scale = function(circle, s) {
	return new Circle(circle.center, circle.radius * s)
}


/** 
 * @description Returns true if the first circle engulfs the second.
 * @returns {boolean}
 */
Circle.engulfsCircle = function(c1, c2) {
	if (c1.radius <= c2.radius) { 
		return false; 
	}
	
	let d = Vector.squaredDistanceBetween(c1.center, c2.center);
	let dr = c1.radius - c2.radius; 
	let δ = dr*dr;

	return δ > d;
}


/**
 * @description Returns a human-readable string description.
 * @note For debugging only.
 */
Circle.prototype.toString = function() {
	return 'c: ' + this.center + ' radius: ' + this.radius;
}


module.exports = Circle;

},{"../../vector/vector.js":43}],6:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"../../mat-constants.js":16,"../../memoize.js":36,"../../vector/vector.js":43,"./bezier.js":4,"./circle.js":5,"dup":1}],7:[function(require,module,exports){
'use strict'

let MAT_CONSTANTS    = require('../../mat-constants.js');

let Util         = require('../../util.js');
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
function Shape(bezierArrays) {
	
	if (MatLib._debug_) {
		MatLib._debug_.generated.timing.start = 
			performance.now(); 
	}

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
			if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
				MatLib._debug_.generated.sharpCorners.push({pos});
			}			
		} else {
			if (PointOnShape.isPointingStraightUp(pos)) {
				let key = PointOnShape.makeSimpleKey(pos);
				this.straightUpHash[key] = pos;	
			}
			
			if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
				if (pos.type === MAT_CONSTANTS.pointType.dull) {
					MatLib._debug_.generated.dullCorners.push({pos});
				}
			}
		}
	});
	
	
	this.contactPointsPerLoop = 
		createSharpCornerCpLoops(this, sharpCornersArray);
	
	if (MatLib._debug_) {
		MatLib._debug_.generated.timing.after1Prongs = 
			performance.now(); 
	}
}


/**
 * @description Creates the initial ContactPoint loops from the given
 * sharp corners.
 * @param {Shape} shape
 * @param {PointOnShape[][]} sharpCornersArray
 * @returns {LinkedLoop[]}
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
 * @returns {LinkedLoop} The reversed loop.
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
 * @param {Bezier} bezier
 * @param {number} idx
 * @returns {Bezier} The freshly reversed bezier.
 */
function reverseBezier(bezier, idx) {
	let bezierPoints = [];
	for (let i=3; i>=0; i--) {
		bezierPoints.push(bezier.bezierPoints[i]);
	}
	let reversedBezier = new Bezier(bezierPoints, idx);
	
	return reversedBezier;
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
 * @description .
 * @param contactPointArr
 * @returns {LinkedLoop}
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
 * @description Get potential 2-prong points on shape.
 * @param {Shape} shape
 * @returns {Object}
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
 * @param {LinkedLoop[]} contactPointsPerLoop
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
 * @description Calculates and returns total absolute curvature between
 * the given contact points.
 * @param {ContactPoint[]}
 * @returns {Object}
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
 * @returns {PointOnShape[][]} - A list of interesting points on the 
 * shape.
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


/**
 * @description .
 * @param {Shape} shape
 * @param bezierLoop
 * @returns {PointOnShape[]}
 */
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
 * @description Get the angle between the given bezier endpoint and the
 * startpoint of the next bezier.
 * @param {ListNode} bezierNode
 * @returns {number}
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
 * @returns {Funtion}
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
 * @description .
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
 * @description .
 * @private
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

},{"../../geometry/classes/bezier-piece.js":3,"../../geometry/classes/bezier.js":4,"../../geometry/classes/point-on-shape.js":6,"../../linked-loop/linked-loop.js":13,"../../ll-rb-tree//ll-rb-tree.js":15,"../../mat-constants.js":16,"../../mat/classes/contact-point.js":18,"../../mat/classes/mat-circle.js":21,"../../memoize.js":36,"../../polynomial/polynomial.js":39,"../../svg/svg.js":41,"../../util.js":42,"../../vector/vector.js":43,"../functions/get-bezier-osculating-circles.js":9,"../functions/get-contact-circles-at-bezier-bezier-interface.js":11}],8:[function(require,module,exports){
'use strict'

let Bezier = require('../classes/bezier.js');

const DELTA = 1e-6;

/** 
 * @description Calculates the curvature extrema brackets of the given
 * bezier.
 *  
 * @see the paper at: http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
 * @note Naming conventions roughly as in the paper above.
 */
function calcCurvatureExtremaBrackets(bezier) {
	
	let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = bezier.bezierPoints;
		
	let brackets = [];
	
	// Bezier points translated to origin;
	let P_1x = x1 - x0; 
	let P_1y = y1 - y0;
	let P_2x = x2 - x0; 
	let P_2y = y2 - y0;
	let P_3x = x3 - x0; 
	let P_3y = y3 - y0;
	
	// Distance to consecutive points
	let W_0x = P_1x;
	let W_1x = P_2x-P_1x;
	let W_2x = P_3x-P_2x;
	let W_0y = P_1y;
	let W_1y = P_2y-P_1y;
	let W_2y = P_3y-P_2y;
	
	// Check for degenerate case in which cubic curve becomes quadratic. 
	if ((Math.abs(W_0x - 2*W_1x + W_2x) < DELTA) && 
		(Math.abs(W_0y - 2*W_1y + W_2y) < DELTA)) {
		// TODO - This case is simpler due to being quadratic but we're 
		// lazy now and will skip it for the moment. Any takers?
	}

	
	// See : http://ac.els-cdn.com/S037704270000529X/1-s2.0-S037704270000529X-main.pdf?_tid=0b25a2cc-ad35-11e5-a728-00000aacb362&acdnat=1451288083_86359fc83af9dec3232c90a6d2e71031
	// Rotate curve so that W0 - 2W1 + W2 = (0, (1/3)a), a != 0
	let atan_numer = P_3x - 3*P_2x + 3*P_1x;
	let atan_denom = P_3y - 3*P_2y + 3*P_1y;
	let atan_numer_squared = atan_numer * atan_numer;
	let atan_denom_squared = atan_denom * atan_denom;
	let radpre = (atan_numer_squared / atan_denom_squared) + 1;
	let rad = Math.sqrt(radpre);
	let cos_theta = 1/rad;
	let sin_theta;
	if (cos_theta === 0) { // edge case
		sin_theta = 1;
	} else {
		sin_theta = atan_numer / (atan_denom * rad);	
	}
	
	
	// For next rotated points see Maxima file bez5 - here we skip 
	// expensive trig evaluations
	let R_0x = 0;
	let R_0y = 0;
	let R_1x = P_1x*cos_theta - P_1y*sin_theta;
	let R_1y = P_1x*sin_theta + P_1y*cos_theta; 
	let R_2x = P_2x*cos_theta - P_2y*sin_theta;
	let R_2y = P_2x*sin_theta + P_2y*cos_theta;			
	let R_3x = P_3x*cos_theta - P_3y*sin_theta;
	let R_3y = P_3x*sin_theta + P_3y*cos_theta;
	
	// Modify W_0x, etc. to be correct for new rotated curve 
	W_0x = R_1x;
	W_1x = R_2x-R_1x;
	W_2x = R_3x-R_2x;
	W_0y = R_1y;
	W_1y = R_2y-R_1y;
	W_2y = R_3y-R_2y;
	
	let a_ =  3 * (W_0y - 2*W_1y + W_2y);
	let dif = R_2x - 2*R_1x;  // which = W_1x - W_0x;
	if (dif === 0) {
		// Case 1 (special) - W_1x - W_0x === 0
		// Degenerate to cubic function	
		
		if (W_0x !== 0) {  
			// TODO - FINISH!!!
			// TODO - we also still need to check for degenerate cubic 
			// (see start of paper)
		} else {
			// We have a straight line x=0!
			return [];
		}
	} else {
		// Case 2 (usual) - W_1x - W_0x !== 0
		
		if (dif < 0) {
			// Reflect curve accross y-axis to make dif > 0
			R_1x = -R_1x;
			R_2x = -R_2x;
			R_3x = -R_3x;
			
			// Modify W_0x, etc. to be correct for new reflected 
			W_0x = -W_0x;
			W_1x = -W_1x;
			W_2x = -W_2x;
			
			dif = -dif; 
		}
		
		// From the paper:
		// ---------------
		// All curves has exactly one of 4 cases:
		//
		// 1. It has a single inflection point and exactly 2 curvature 
		//    maxima (symmetrically positioned about inflection point).
		//    This is the case if dif === 0 in above code.
		// 2. It has a single cusp - we ignore this case for now - but 
		//    we must still do it!
		// 3. It has a point of self-intersection - occurs if d < 0 in 
		//    paper (in code d is called sigd_). 
		// 4. It has 2 inflection points, no cusps, no self-
		//    intersections.
		//    It can have either 3 or 5 curvature extrema
		//    a. The case of 5 curvature extrema is ignored for now - 
		//       in the paper it is mentioned to even find such a curve 
		//       is difficult and it seems such curves have very sharp 
		//       curvature at one point which should not usually occur 
		//       in an SVG shape. 
		//       But this case should later be included or we'll miss 
		//       some points.
		//    b. There are 3 curvature extrema:
		//       Extrema occur in the range (-inf, -sqrt(d)), 
		//       (-sqrt(d), sqrt(d)), (sqrt(d), inf). 
		//       Since we dont know how to select -inf and inf we will 
		//       just choose them to be -10 and 11 (remember bezier runs 
		//       from t=0 to t=1). If Brent's method runs out of the 
		//       (0,1) interval we stop and use 0 or 1 as the extremum? 
		//       Remember extrema can also occur at t=0 and t=1!
		//
		// At the moment we only test for case 1 and 4b, but in future 
		// we can test and eliminate the other cases.
		
		
		let mu = 6*dif;
		let lambda = (3 * a_ * W_0x) / (mu*mu);
		let gamma1 = (3 * a_ * W_0y) / (mu*mu); 
		let gamma2 = (3 * (W_1y - W_0y)) / (mu);
		// This d in the paper
		let sigd_ = lambda*lambda - 2*gamma2*lambda + gamma1; 
		let b_ = 2*(gamma2 - lambda);
		
		let deReParamBoundary = 
			deReParameterizeBoundary(lambda, mu, a_);
		
		if (sigd_ > 0) {
			let ssigd_ = Math.sqrt(sigd_);
			
			//console.log(ssigd_);
			// de-reparametize
			// Note: the sda and sdb here are the inflection points for 
			// a case iv!! there are easier ways to calculate these
			let sda = -ssigd_;  
			let sdb = ssigd_;
			brackets = 
				[
					[Number.NEGATIVE_INFINITY, sda], 
					[sda,sdb], 
					[sdb,Number.POSITIVE_INFINITY]
				]
				.map(deReParamBoundary)
				.map(clipBoundary);

		} else if (sigd_ < 0) {
			// Loop 
			// Note: The loop intersection may be outside t=[0,1]. 
			// In fact, for a well behaved shape this is always the 
			// case.
			// But, curvature maxima may still occur inside t=[0,1] 
			// of course.
			// There can be 1 or 3 maxima of curvature
			
			let ksi_pre1 = 2*b_*b_ - 8*sigd_ - 3;
			
			if (ksi_pre1 < 0) {
				brackets = [
				    [0, Math.sqrt(-3*sigd_)]  
				]
				.map(deReParamBoundary)
				.map(clipBoundary);
			} else {
				let ksi_pre2 =  Math.sqrt(5*ksi_pre1);
				let ksi1 = (-5*b_ - ksi_pre2) / 10; 				
				let ksi2 = (-5*b_ + ksi_pre2) / 10;
				
				brackets = [
				    [Number.NEGATIVE_INFINITY, ksi1], 
				    [ksi1, Math.min(0, ksi2)], 
				    [Math.max(0, ksi2), Math.sqrt(-3*sigd_)]  
				]
				.map(deReParamBoundary)
				.map(clipBoundary);
			}
		} else if (sigd_ === 0) {
			// TODO Cusp - ignore for now - lazy
		}
	}	
	
	return brackets;
}


/** 
 * @description Clips to [0,1] or returns false if not within [0,1].
 */ 
function clipBoundary(bound) {
	let b0 = bound[0];
	let b1 = bound[1];
	
	if ((b0 < 0 && b1 < 0) || (b0 > 1 && b1 > 1)) {
		return false;
	}
	
	if (b0 < 0) { b0 = 0; }
	if (b0 > 1) { b0 = 1; }				
	if (b1 < 0) { b1 = 0; }
	if (b1 > 1) { b1 = 1; }				
	
	return [b0,b1];
}


/**
 * @returns {Function}
 */
function deReParameterize(lambda, mu, a_) {
	return function(sigma) {
		return (sigma - lambda) * (mu / a_);	
	}
};


/**
 * 
 */
function deReParameterizeBoundary(lambda, mu, a_) {
	return function(boundary) {
		return boundary.map(deReParameterize(lambda, mu, a_));	
	}
};


module.exports = calcCurvatureExtremaBrackets;
},{"../classes/bezier.js":4}],9:[function(require,module,exports){
'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');

let Bezier        = require('../classes/bezier.js');
let Circle        = require('../../geometry/classes/circle.js');
let PointOnShape  = require('../../geometry/classes/point-on-shape.js');
let Poly          = require('../../polynomial/polynomial.js');

let calcBezierCurvatureExtremaBrackets = require('./calc-bezier-curvature-extrema.js');


/** 
 * @description Finds the osculating circles for the given bezier. 
 **/
function getBezierOsculatingCircles(bezierNode) {

	let pointsOnShape = [];
	
	let root;
	let bezier = bezierNode.item;
	let brackets = calcBezierCurvatureExtremaBrackets(bezier);
	 
	let lenb = brackets.length;
	for (let k=0; k<lenb; k++) {
		let bracket = brackets[k];
		if (!bracket) { continue; }
		
		let root = lookForRoot(bezier, bracket);
		if (!root) { continue; }
		
		let κ = -Bezier.κ(bezier)(root);
		// Check if local extrema is a maximum or minimum.
		let κAtMinsd = -Bezier.κ(bezier)(bracket[0]);
		let κAtMaxsd = -Bezier.κ(bezier)(bracket[1]);
		
		if (κ > κAtMinsd && κ > κAtMaxsd) {
			// maximum
		} else if (κ <= κAtMinsd && κ <= κAtMaxsd) {
			// minimum
			continue; 
		}
		
		let pos = new PointOnShape(
			bezierNode, 
			root, 
			MAT_CONSTANTS.pointType.standard, 
			0,
			0
		);
			
		pointsOnShape.push(pos);
	}

	pointsOnShape.sort(PointOnShape.compare);
	
	return pointsOnShape;
}


function lookForRoot(bezier, [minsd, maxsd]) {
	
	// At this point there can be exactly 0 or 1 roots within 
	// [minsd, maxsd]
	let c0 = Bezier.dκ(bezier)(minsd);
	let c1 = Bezier.dκ(bezier)(maxsd);
	
	if (c0*c1 >= 0) { return; }
	
	// There is exactly one root in the interval.
	let root = Poly.brent(
			Bezier.dκ(bezier), 
			minsd, maxsd
	);
	
	return root;
}


module.exports = getBezierOsculatingCircles;

},{"../../geometry/classes/circle.js":5,"../../geometry/classes/point-on-shape.js":6,"../../mat-constants.js":16,"../../polynomial/polynomial.js":39,"../classes/bezier.js":4,"./calc-bezier-curvature-extrema.js":8}],10:[function(require,module,exports){
'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');

let Poly          = require('../../polynomial/polynomial.js');
let Geometry      = require('../geometry.js');
let Vector        = require('../../vector/vector.js');

let Bezier        = require('../classes/bezier.js');
let PointOnShape  = require('../classes/Point-on-shape.js');
  

/**
 * Gets the closest boundary point to the given point, limited to the
 * given bezier pieces.
 * 
 * @param {BezierPiece[]} bezierPieces
 * @param {Number[]} p
 * @param {ListNode} touchedBezierNode
 * @returns {PointOnShape} The closest point.
 */
function getClosestBoundaryPointToPoint(
		bezierPieces_, point, 
		touchedBezierNode, t) {
	
	let bezierPieces = cullBezierPieces(bezierPieces_, point)
 

	let bestDistance = Number.POSITIVE_INFINITY;
	let pos;
	for (let bezierPiece of bezierPieces) {
		let bezier = bezierPiece.bezierNode.item;

		let p = closestPointOnBezier(
				bezierPiece.bezierNode, 
				point, 
				bezierPiece.tRange, 
				touchedBezierNode, 
				t
		);
		
		let d = p === undefined
			? Number.POSITIVE_INFINITY 
			: Vector.distanceBetween(p.p, point);

		if (d < bestDistance) {
			pos = new PointOnShape(
					bezierPiece.bezierNode, 
					p.t, 
					MAT_CONSTANTS.pointType.standard, 
					0,
					0 
			);
			bestDistance = d;
		}
	}
	
	return pos;
}


function cullBezierPieces(bezierPieces,	p) {
	
	const CULL_THRESHOLD = 5; // TODO Put somewhere better.
	
	let shortCircuit = bezierPieces.length > CULL_THRESHOLD;
	if (shortCircuit) {
		// First get an initial point such that the closest point 
		// can not be further than this point.
		let bestSquaredDistance = getClosePoint(
				bezierPieces, p
		);
		bezierPieces = cullByLooseBoundingBox(
				bezierPieces, p,
				bestSquaredDistance
		);
		bezierPieces = cullByTightBoundingBox(
				bezierPieces, p,
				bestSquaredDistance
		);
	}
	
	return bezierPieces;
}

/**
 * Finds an initial point such that the closest point
 * can not be further than this point.
 */ 
function getClosePoint(bezierPieces, p) {
	let bestSquaredDistance = Number.POSITIVE_INFINITY;
	for (let bezierPiece of bezierPieces) {
		let bezier = bezierPiece.bezierNode.item;
		
		let p1 = Bezier.evaluate(bezier)( bezierPiece.tRange[0] );
		let p2 = Bezier.evaluate(bezier)( bezierPiece.tRange[1] );
		
		let d1 = Vector.squaredDistanceBetween(p, p1);
		let d2 = Vector.squaredDistanceBetween(p, p2);
		let d = Math.min(d1,d2); 
		
		if (d < bestSquaredDistance) {
			bestSquaredDistance = d;  
		}
	}
	
	// The extra bit is to account for floating point precision 
	// TODO change 0.01 below to more meaningfull value dependent on 
	// shape dimensions.
	return bestSquaredDistance + 0.01;
}


/**
 * When checking distances, ignore all those with closest 
 * possible distance further than 'bestSquaredDistance',
 * i.e. cull them.
 */
function cullByLooseBoundingBox(
		bezierPieces,
		p,
		bestSquaredDistance) {

	let candidateBezierPieces = [];
	
	for (let bezierPiece of bezierPieces) {
		let bezier = bezierPiece.bezierNode.item;
		
		//let looseBoundingBox = bezier.getBoundingBox();
		let looseBoundingBox = Bezier.getBoundingBox(bezier);
		
		let d = Geometry.getClosestSquareDistanceToRect(
				looseBoundingBox,
				p
		);
		if (d <= bestSquaredDistance) {
			candidateBezierPieces.push(bezierPiece);
		} 
	}
	
	return candidateBezierPieces;
}


/**
 * When checking distances, ignore all those with closest 
 * possible distance further than 'bestSquaredDistance',
 * i.e. cull them.
 */
function cullByTightBoundingBox(
		bezierPieces, 
		p,
		bestSquaredDistance) {
	
	let candidateBezierPieces = []; 

	for (let bezierPiece of bezierPieces) {
		let bezier = bezierPiece.bezierNode.item;
		
		let tightBoundingBox = Bezier.getBoundingBoxTight(bezier);
		let d = Geometry.closestSquaredDistanceToRotatedRect(
				bezier,
				p
		);
		if (d <= bestSquaredDistance) {
			candidateBezierPieces.push(bezierPiece);
		} 
	} 
	
	return candidateBezierPieces;
}


/**
 * 
 */
function closestPointOnBezier(
		bezierNode, p, tRange, touchedBezierNode, t) {
	
	let bezier = bezierNode.item;
	let touchedBezier = touchedBezierNode ? touchedBezierNode.item : undefined;
	
	// TODO The site at http://jazzros.blogspot.ca/2011/03/projecting-point-on-bezier-curve.html
	// may hint at requiring much fewer assignments?
	let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = bezier.bezierPoints;
	let [xp, yp] = p;
	
	let xx0 = x0 - xp;
	let xx1 = x1 - xp;
	let xx2 = x2 - xp;
	let xx3 = x3 - xp;
	let yy0 = y0 - yp;
	let yy1 = y1 - yp;
	let yy2 = y2 - yp;
	let yy3 = y3 - yp;
	
	let x00 =    xx0*xx0;
	let x01 = 6 *xx0*xx1;
	let x02 = 6 *xx0*xx2;
	let x03 = 2 *xx0*xx3;
	let x11 = 9 *xx1*xx1;
	let x12 = 18*xx1*xx2;
	let x13 = 6 *xx1*xx3;
	let x22 = 9 *xx2*xx2;
	let x23 = 6 *xx2*xx3;
	let x33 =    xx3*xx3;
	
	let y00 =    yy0*yy0;
	let y01 = 6 *yy0*yy1;
	let y02 = 6 *yy0*yy2;
	let y03 = 2 *yy0*yy3;
	let y11 = 9 *yy1*yy1;
	let y12 = 18*yy1*yy2;
	let y13 = 6 *yy1*yy3;
	let y22 = 9 *yy2*yy2;
	let y23 = 6 *yy2*yy3;
	let y33 =    yy3*yy3;
	
	let t5 = 6 * ((x33 -   x23 +  x13  -    x03  +   x22  -    x12 +    x02 +    x11 -   x01 + x00) + 
			      (y33 -   y23 +  y13  -    y03  +   y22  -    y12 +    y02 +    y11 -   y01 + y00));
	let t4 = 5 * ((x23 - 2*x13 + 3*x03 -  2*x22  + 3*x12  -  4*x02 -  4*x11 +  5*x01 - 6*x00) +
				  (y23 - 2*y13 + 3*y03 -  2*y22  + 3*y12  -  4*y02 -  4*y11 +  5*y01 - 6*y00));
	let t3 = 4 * ((x13 - 3*x03 +   x22 -  3*x12  + 6*x02  +  6*x11 - 10*x01 + 15*x00) +
				  (y13 - 3*y03 +   y22 -  3*y12  + 6*y02  +  6*y11 - 10*y01 + 15*y00));	
	let t2 = 3 * ((x03 +   x12 - 4*x02 -  4*x11  + 10*x01 - 20*x00) +
				  (y03 +   y12 - 4*y02 -  4*y11  + 10*y01 - 20*y00));
	let t1 = 2 * ((x02 +   x11 - 5*x01 + 15*x00) +
				  (y02 +   y11 - 5*y01 + 15*y00));
	let t0 =     ((x01 - 6*x00) +
				  (y01 - 6*y00));
	
	
	let poly = [t5,t4,t3,t2,t1,t0];
	
	if (bezier === touchedBezier) {
		let deflatedPoly = Poly.deflate(poly, t);
		poly = deflatedPoly;
	}
	

	//let allRoots = allRootsVAS(poly, tRange);
	let allRoots = Poly.allRoots01(poly);
	let roots = allRoots.filter(function(root) {
		return root >= tRange[0] && root <= tRange[1];
	});
	
	
	let push0 = true;
	let push1 = true;
	if ((t === 1 && bezierNode === touchedBezierNode.next) ||
	    (bezier === touchedBezier && t === 0)) {
		push0 = false;
	}
	if ((t === 0 && bezierNode === touchedBezierNode.prev) ||
		(bezier === touchedBezier && t === 1)) {
		push1 = false;
	}

	if (tRange[0] === 0) {
		if (push0) { roots.push(tRange[0]); }
	} else if (tRange[0] === 1) {
		if (push1) { roots.push(tRange[0]); }
	} else {
		roots.push(tRange[0]);
	}
	
	if (tRange[1] === 0) {
		if (push0) { roots.push(tRange[1]); }
	} else if (tRange[1] === 1) {
		if (push1) { roots.push(tRange[1]); }
	} else {
		roots.push(tRange[1]);
	}
	

	let ps = roots.map(function(root) {
		return { p: Bezier.evaluate(bezier)(root), t: root };
	});
	let closestPoint = Vector.getClosestTo(p, ps, function(p1, p2) {
		return Vector.squaredDistanceBetween(p1, p2.p);
	});
	

	return closestPoint;
}


module.exports = getClosestBoundaryPointToPoint;

},{"../../mat-constants.js":16,"../../polynomial/polynomial.js":39,"../../vector/vector.js":43,"../classes/Point-on-shape.js":1,"../classes/bezier.js":4,"../geometry.js":12}],11:[function(require,module,exports){
'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');
let Circle        = require('../../geometry/classes/circle.js');
let PointOnShape  = require('../../geometry/classes/point-on-shape.js');
let Vector        = require('../../vector/vector.js');
let Bezier        = require('../classes/bezier.js');


// Angle in degrees
const DEGREES = {
		'0'    : 0.0000,
		'0.25' : 0.0050,
		'1'    : 0.0167,
		'4'    : 0.0698,
		'15'   : 0.2588,
		'16'   : 0.2756,
};

const CROSS_TANGENT_LIMIT = DEGREES[0.25]; 


/** 
 * Get the circles at the bezier-bezier interface points with circle
 * curvature coinciding with the bezier curvature at those points. 
 * 
 * @param {ListNode[]} bezierNodes - The two bezier nodes.
 **/
function getContactCirclesAtBezierBezierInterface(
		bezierNodes, dullCornerHash) {
	
	const ts = [1,0];
	
	let beziers = [0,1].map(i => bezierNodes[i].item );
	let tans    = [0,1].map(i => Bezier.tangent(beziers[i])(ts[i]));  

	let crossTangents = +Vector.cross(tans[0], tans[1]);
	let negDot        = -Vector.dot  (tans[0], tans[1]);
	
	// The if below is important. Due to floating point approximation
	// it sometimes happen that crossTangents !== 0 but
	// negDot === -1. Remove the if and see what happens. :)
	if (crossTangents === 0 || negDot === -1) {
		// Too close to call 
		return [];
	}
	
	let p = beziers[0].bezierPoints[3];
	
	
	if (crossTangents < -CROSS_TANGENT_LIMIT) {  
		// Sharp corner
		let pos = new PointOnShape(
			bezierNodes[0], 
			1, 
			MAT_CONSTANTS.pointType.sharp, 
			0,
			0
		); 

		return [pos];
	} 
	
	
	if (crossTangents > 0) {
		let key = PointOnShape.makeSimpleKey(p);
		dullCornerHash[key] = { beziers, tans };
	}
	
	if (crossTangents <= CROSS_TANGENT_LIMIT) {
		// The interface is too straight, but put a point close-by.
		// TODO - this point may be order wrong in the end causing 
		// disaster. Fix.
		let pos = new PointOnShape(
				bezierNodes[0], 
				0.9, 
				MAT_CONSTANTS.pointType.standard, 
				0,
				0
			);
		
		return [pos];
	}
	

	//---- Dull corner
	let pointsOnShape = [];
	
	let orders = [-1, negDot];
	for (let i=0; i<2; i++) {
		let pos = new PointOnShape(
			bezierNodes[i], 
			ts[i], 
			MAT_CONSTANTS.pointType.dull, 
			orders[i],
			0
		);
		
		pointsOnShape.push(pos);	
	}
	
	return pointsOnShape;
}


module.exports = getContactCirclesAtBezierBezierInterface;

},{"../../geometry/classes/circle.js":5,"../../geometry/classes/point-on-shape.js":6,"../../mat-constants.js":16,"../../vector/vector.js":43,"../classes/bezier.js":4}],12:[function(require,module,exports){
'use strict'

let Util         = require('../util.js');
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
 * @description .
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
 * @description .
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
 * @description .
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
 * @description .
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
 * @description .
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
 * @description .
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
 * @returns {Object[]} 
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

},{"../memoize.js":36,"../polynomial/polynomial.js":39,"../util.js":42,"../vector/vector.js":43,"./classes/arc.js":2,"./classes/bezier.js":4,"./classes/circle.js":5,"./classes/point-on-shape.js":6,"./classes/shape.js":7}],13:[function(require,module,exports){
'use strict'

let LlRbTree = require('../ll-rb-tree/ll-rb-tree.js');
let ListNode = require('./list-node.js');
	

/**
 * Represents a two-way linked loop. 
 * @constructor 
 *
 * @param comparator - Tree item comparator
 * @param {number} indx - Loop identifier.
 * @note If called with an array, must be called with a sorted array if  
 * comparator is not given. 
 */
function LinkedLoop(array, comparator, indx) {
	if (comparator) {
		this.cptree = new LlRbTree(comparator);
	} 
	
	this.indx = indx;
	
	this.addAllFromScratch(array || []);
}


/**
 * Insert an item into the linked loop after specified point 
 * 
 * @param item  {*} - Item to insert.
 * @param prev - Insert new item right after this item.
 * @param coupledNode
 */
LinkedLoop.insert = function(loop, item, prev_, coupledNode) {

	let node = new ListNode(
			loop, item, undefined, undefined 
	);
	
	
	let prev;
	let next;
	
	if (!loop.head) {
		prev = node;
		next = node;
		
		loop.head = node;
	} else {
		prev = prev_;
		next = prev.next;
	}

	
	next.prev = node;
	prev.next = node;
	node.prev = prev;
	node.next = next;
		
	node.coupledNode = coupledNode;
	
	if (loop.cptree) {
		LlRbTree.insert(loop.cptree, node);
	};
	
	return node;
}


/**
 * 
 */
LinkedLoop.remove = function(loop, node) {
	
	let prev = node.prev;
	let next = node.next;
	
	if (node === loop.head) {
		loop.head = next; 
	}
	
	prev.next = next;
	next.prev = prev;
	
	if (loop.cptree) { 
		// TODO - could be made faster by removing on item directly
		//loop.cptree.remove(item); 
		LlRbTree.remove(loop.cptree, node);
	};
}


/**
 * @description .
 */
LinkedLoop.getAsArray = function(loop) {
	let nodes = [];
	
	let node = loop.head;
	do {
		nodes.push(node.item);
		
		node = node.next;
	} while (node !== loop.head);
	
	return nodes;
}


/**
 * 
 */
LinkedLoop.forEach = function(loop, f) {
	
	let node = loop.head;
	do {
		f(node);
		
		node = node.next;
	} while (node !== loop.head);
}


/**
 * @description Returns the item at the specified index position.
 * @note This is slow ( O(n) ); use in debugging code only.
 */
LinkedLoop.getByIndx = function(linkedLoop, n) {
	return ListNode.advanceNSteps(linkedLoop.head, n);
}


/**
 * 
 */
LinkedLoop.prototype.addAllFromScratch = function(arr) {

	if (arr.length === 0) { return; }
	
	var head;
	var prevNode = null;
	let node;
	
	for (let i=0; i<arr.length; i++) {
		
		node = new ListNode(
			this,
			arr[i],
			prevNode,
			null,
			i
		);
		
		if (prevNode) { prevNode.next = node; }
		prevNode = node; 
		
		if (i === 0) { head = node; }
		
		
		if (this.cptree) { 
			LlRbTree.insert(this.cptree, node)  
		};
	}
	
	// Close loop
	head.prev = node;
	node.next = head;
		
	
	this.head = head;
}
	

module.exports = LinkedLoop;

},{"../ll-rb-tree/ll-rb-tree.js":15,"./list-node.js":14}],14:[function(require,module,exports){
/**
 * Representation of a linked loop vertex (i.e. node) having various  
 * edges, two of which enforce an ordering on the nodes, i.e. 'prev'
 * and 'next'.
 *  
 * @constructor
 * @param {*} item - The actual item stored at a node.
 * @param {ListNode} prev - The previous item.
 * @param {ListNode} next - The next item.
 */
function ListNode(
		loop, item, prev, next) {
	
	this.loop = loop;
	
	this.item = item;
	this.prev = prev;	
	this.next = next;
}


/**
 * @description Advances the node by the given number of steps.
 * @note This is slow ( O(n) ); use in debugging code only.
 */
ListNode.advanceNSteps = function(node, n) {
	for (let i=0; i<n; i++) {
		node = node.next;
	}
	
	return node;
}


module.exports = ListNode;

},{}],15:[function(require,module,exports){
'use strict'

/*
 * Concise, Destructive, Left Leaning Red Black Tree implementation.
 * See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
 * See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
 * See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html 
 */

const LEFT  = false;
const RIGHT = true;

const RED   = true;const BLACK = false;


/**
 * Red Black Tree node.
 * @constructor 
 * @param {*} data
 */
function Node(data) {
	this.data = data;
	this.red  = true;
}


Node.isRed = function(node) {
    return node && node.red;
}


/** 
 * @constructor 
 */	
function LlRbTree(comparator) {
	this.comparator = comparator;
    this.root = null;
}


function getMinOrMaxNode(dir, node) {
	return function(node) {
		while (node[dir]) {
	    	node = node[dir];
	    }
	    return node;	
	}
}


LlRbTree.getMinNode = getMinOrMaxNode(LEFT);
LlRbTree.getMaxNode = getMinOrMaxNode(RIGHT);

LlRbTree.min = function(node) {
	return LlRbTree.getMinNode(node).data;
}

LlRbTree.max = function(node) {
	return LlRbTree.getMaxNode(node).data;
}


/**
 * @return The 2 nodes bounding the data. If overflow occurs, min is 
 * returned as the second one. If bounds cannot be found (tree is empty 
 * or contains 1 item) returns null. If the data falls on a node, that 
 * node and the next (to the right) is returned. 
 */
LlRbTree.findBounds = function(tree, data) {
	let node = tree.root;
	
	if (node === null) { return null; }

	var bounds = [];
    while (node) {
        var c = tree.comparator(data, node.data);  
        if (c >= 0) { 
        	bounds[0] = node;
        } else {
        	bounds[1] = node;
        }
        
        node = node[c >= 0];
    }

    return bounds;
}


/**
 * Find the node in the tree with the given data using ===. 
 * 
 * @return {Node} node or null if not found.
 */
LlRbTree.find = function(tree, data) {
    let node = tree.root;

    while (node) {
        let c = tree.comparator(data, node.data);
        if (c === 0) {
            return node;
        } else {
        	node = node[c > 0];
        }
    }

    return null;
}


/**
 * Inserts a node with given data into the tree.
 */
LlRbTree.insert = function(tree, data) {
	tree.root = insert(tree.root, data);
	tree.root.red = false; 
	
	function insert(h, data) {
		if (h == null) {
			return new Node(data);
		}
		
		if (Node.isRed(h[LEFT]) && Node.isRed(h[RIGHT])) {
			flipColors(h);
		}
		
		let cmp = tree.comparator(data, h.data);
		if (cmp === 0) {
			h.data = data;
		} else if (cmp < 0) {
			h[LEFT] = insert(h[LEFT], data);
		} else {
			h[RIGHT] = insert(h[RIGHT], data);
		}
		
		if (Node.isRed(h[RIGHT]) && !Node.isRed(h[LEFT])) {
			h = rotate(LEFT, h);
		}
		if (Node.isRed(h[LEFT]) && Node.isRed(h[LEFT][LEFT])) {
			h = rotate(RIGHT, h);
		}
		
		return h;
	}
}


function rotate(dir, h) {
	let x = h[!dir];
	h[!dir] = x[dir];
	x[dir] = h;
	x.red = h.red;
	h.red = true;
	
	return x;
}


function flipColors(h) {
	h.red = !h.red;
	h[LEFT].red = !h[LEFT].red;
	h[RIGHT].red = !h[RIGHT].red;
}


function moveRedLeft(h) {
	flipColors(h);
	if (Node.isRed(h[RIGHT][LEFT])) {
		h[RIGHT] = rotate(RIGHT, h[RIGHT]);
		h = rotate(LEFT, h);
		flipColors(h);
	}
	
	return h;
}


function moveRedRight(h) {
	flipColors(h);
	if (Node.isRed(h[LEFT][LEFT])) {
		h = rotate(RIGHT, h);
		flipColors(h);
	}
	
	return h;
}


/**
 * Removes an item from the tree based on the given data (using ===). 
 * 
 * Note: Currently, a precondition is that the data must exist in the 
 * tree. In the future we can easily modify the code to relax this 
 * requirement. 
 */
LlRbTree.remove = function(tree, data) {
	tree.root = remove(tree.root, data);
	if (tree.root) { tree.root.red = false; }
	
	function remove(h, data) {
		if (tree.comparator(data, h.data) < 0) {
			if (!Node.isRed(h[LEFT]) && !Node.isRed(h[LEFT][LEFT])) {
				h = moveRedLeft(h);
			}
			h[LEFT] = remove(h[LEFT], data);
			
			return fixUp(h);
		} 
		
		
		if (Node.isRed(h[LEFT])) {
			h = rotate(RIGHT, h);
		}
		
		if (!h[RIGHT] && tree.comparator(data, h.data) === 0) {
			return null;
		}
		if (!Node.isRed(h[RIGHT]) && (!Node.isRed(h[RIGHT][LEFT]))) {
			h = moveRedRight(h);
		}
		
		if (tree.comparator(data, h.data) === 0) {
			h.data = LlRbTree.min(h[RIGHT]);  
			h[RIGHT] = removeMin(h[RIGHT]);
		} else {
			h[RIGHT] = remove(h[RIGHT], data);
		}
		
		return fixUp(h);
	}
	
	
	function removeMin(h) {
		if (!h[LEFT]) {
			return null;
		}
		if (!Node.isRed(h[LEFT]) && !Node.isRed(h[LEFT][LEFT])) {
			h = moveRedLeft(h);
		}
		h[LEFT] = removeMin(h[LEFT]);
		
		return fixUp(h);
	}	
}


/**
 * Fix right-leaning red nodes.
 */
function fixUp(h)	{
    if (Node.isRed(h[RIGHT])) {
        h = rotate(LEFT, h);
    }

    if (Node.isRed(h[LEFT]) && Node.isRed(h[LEFT][LEFT])) {
        h = rotate(RIGHT, h);
    }

    // Split 4-nodes.
    if (Node.isRed(h[LEFT]) && Node.isRed(h[RIGHT])) {
        flipColors(h);
    }

    return h;
}


module.exports = LlRbTree;

},{}],16:[function(require,module,exports){
'use strict'

const MAT_CONSTANTS = {
		// TODO - should be dynamic and of order of shape dimensions.
		maxOsculatingCircleRadius: 800,
		pointType: {
				'standard' : 0, // Not special,   
				'sharp'    : 1, // Sharp corner, 
				'dull'     : 2, // dull corner,
				'extreme'  : 3, // Topmost point on loop
		}
}


module.exports = MAT_CONSTANTS;

},{}],17:[function(require,module,exports){
//---- Constants
let MAT_CONSTANTS   = require('./mat-constants.js');

//---- Functions 
let smoothen        = require('./mat/functions/smoothen.js');
let findMat         = require('./mat/functions/find-mat.js');
let toScaleAxis     = require('./mat/functions/to-scale-axis.js');

//---- Classes - can be instantiated
let Bezier          = require('./geometry/classes/bezier.js');
let MatNode         = require('./mat/classes/mat-node.js');
let Mat             = require('./mat/classes/mat.js');
let MatCircle       = require('./mat/classes/mat-circle.js');
let ContactPoint    = require('./mat/classes/contact-point.js');
let getNodesAsArray = require('./mat/functions/get-nodes-as-array.js');
let PointOnShape    = require('./geometry/classes/point-on-shape.js');
let LinkedLoop      = require('./linked-loop/linked-loop.js');
let LlRbTree        = require('./ll-rb-tree//ll-rb-tree.js');
let Shape           = require('./geometry/classes/shape.js');
let Circle          = require('./geometry/classes/circle.js');
let Svg             = require('./svg/svg.js');

//---- Namespaced utilities
let Geometry        = require('./geometry/geometry.js');
let Util            = require('./util.js');
let Vector          = require('./vector/vector.js');
let Poly            = require('./polynomial/polynomial.js');


//---- Expose our library to the global scope for browsers
// See: http://www.mattburkedev.com/export-a-global-to-the-window-object-with-browserify/

var MatLib = window.MatLib || {};

MatLib = Object.assign(MatLib, {
	// To be set by the user of the library if required.
	_debug_: undefined, 
	
	findMat,
	toScaleAxis,
	smoothen,

	Bezier,
	Mat,
	MatCircle,
	ContactPoint,	
	PointOnShape,
	LinkedLoop,
	LlRbTree,
	Shape,
	Circle,
	Svg,
	
	Geometry,
	Util,
	Vector,
	Poly,
	
	fs: {
		getNodesAsArray,
	}
});


//Replace/Create the global namespace
window.MatLib = MatLib;













},{"./geometry/classes/bezier.js":4,"./geometry/classes/circle.js":5,"./geometry/classes/point-on-shape.js":6,"./geometry/classes/shape.js":7,"./geometry/geometry.js":12,"./linked-loop/linked-loop.js":13,"./ll-rb-tree//ll-rb-tree.js":15,"./mat-constants.js":16,"./mat/classes/contact-point.js":18,"./mat/classes/mat-circle.js":21,"./mat/classes/mat-node.js":22,"./mat/classes/mat.js":23,"./mat/functions/find-mat.js":30,"./mat/functions/get-nodes-as-array.js":31,"./mat/functions/smoothen.js":33,"./mat/functions/to-scale-axis.js":34,"./polynomial/polynomial.js":39,"./svg/svg.js":41,"./util.js":42,"./vector/vector.js":43}],18:[function(require,module,exports){
'use strict'

let PointOnShape = require('../../geometry/classes/point-on-shape.js');
let Vector = require('../../vector/vector.js');


/** 
 * @description Class representing a single contact point of a MatCircle 
 * instance. 
 * @onstructor
 *
 * @param {PointOnShape} pointOnShape
 * @param {MatCircle} matCircle 
 */
function ContactPoint(pointOnShape, matCircle) {
	this.pointOnShape = pointOnShape;
	this.matCircle    = matCircle;
	this.key = PointOnShape.toHumanString(pointOnShape); // TODO
	
	this[0] = pointOnShape[0]; // Shortcut
	this[1] = pointOnShape[1]; // ...
}


ContactPoint.compare = function(a,b) {
	return PointOnShape.compare(a.pointOnShape, b.pointOnShape); 
} 


ContactPoint.equal = function(a,b) {
	return Vector.equal(a,b);
}


module.exports = ContactPoint;

},{"../../geometry/classes/point-on-shape.js":6,"../../vector/vector.js":43}],19:[function(require,module,exports){
'use strict'

let PointOnShape = require('../../../geometry/classes/point-on-shape.js');


function ThreeProngForDebugging(
		threeProng, deltas, bestIndx, candidateThreeProngs) {

	this.threeProng = threeProng;
	this.deltas     = deltas; 
	this.bestIndx   = bestIndx;
	this.candidateThreeProngs = candidateThreeProngs;

	this.deltasSimple = deltas.map(function(delta) {
		return [
			PointOnShape.toHumanString( delta[0].item.pointOnShape ),
			PointOnShape.toHumanString( delta[1].item.pointOnShape )
		]; 
	});
}


module.exports = ThreeProngForDebugging;

},{"../../../geometry/classes/point-on-shape.js":6}],20:[function(require,module,exports){
'use strict'


function TwoProngForDebugging(
		pos, δ, y, z, x, circle, xs, failed, holeClosing) {

	this.pos    = pos;
	this.δ      = δ;
	this.y      = y;
	this.z      = z;
	this.x      = x;
	this.circle = circle;
	this.xs     = xs;
	this.failed = failed;
	this.holeClosing = holeClosing;
}


module.exports = TwoProngForDebugging;

},{}],21:[function(require,module,exports){
'use strict'

let Circle = require('../../geometry/classes/circle.js');


/**
 * Medial (or Scale) Axis Transform (MAT) maximal contact circle class, 
 * i.e. a representative data point of the MAT.
 * 
 * @constructor
 * @param {Circle} circle - If null we consider it a virtual circle.
 * @param {ListNode[]} cpNodes - The contact points of this circle on the shape.
 * @note Do not do 'new MatCircle', rather use 'MatCircle.create'.
 */
function MatCircle(circle, cpNodes) {
	this.circle = circle;
	this.cpNodes = cpNodes;
	this.visited = 0; // TODO - does not belong inside the class
}
	
	
/** 
 * MatCircle creator.
 * @param {Circle} circle 
 * @param {ListNode[]} cpNodes An array of 'orphaned' 
 *        (i.e. without belonging to a MatCircle) contact points.
 * Notes: Due to the mutual dependency between the matCircle and 
 * contactPoints fields, a normal constructor can not instantiate a
 * MatCircle in one step - hence this creator.
 */  
MatCircle.create = function(circle, cpNodes) {
	let matCircle = new MatCircle(circle, undefined);
		
	for (let i=0; i<cpNodes.length; i++) {
		cpNodes[i].item.matCircle = matCircle; 
	}
	matCircle.cpNodes = cpNodes;
	
	return matCircle;
}


module.exports = MatCircle;

},{"../../geometry/classes/circle.js":5}],22:[function(require,module,exports){
'use strict'

let MatCircle = require('./mat-circle.js');


/**
 * @description Representation of a node in the MAT structure.
 * @constructor
 * @param {MatCircle} matCircle
 * @param branches
 */
function MatNode(matCircle, branches) {
	this.matCircle = matCircle;
	this.branches  = branches;		
} 


MatNode.copy = function(node) {
	
	return helper(node, undefined);
	
	function helper(matNode, priorNode, newPriorNode) {
		
		let branches = [];
		let newNode = new MatNode(matNode.matCircle, branches);
		
		for (let node of matNode.branches) {
			if (node === priorNode) {
				// Don't go back in tracks.
				branches.push(newPriorNode);
				continue;
			}
			
			branches.push(helper(node, matNode, newNode));
		}
		
		return newNode;
	}
}


module.exports = MatNode;

},{"./mat-circle.js":21}],23:[function(require,module,exports){
'use strict'

let traverse = require('../../mat/functions/traverse.js');


/**
 * @description The Mat class represents the end product, the Medial  
 * Axis Transform. It is defined recursively as a rooted tree with   
 * each node containing a point, a radius and 1, 2 or 3 branches.
 * 
 * @constructor
 * @param {MatNode} node - A handle on the MAT tree structure.
 */
function Mat(node) {
	this.startNode = node;
} 


Mat = Object.assign(Mat, {
	traverse	
});


module.exports = Mat;

},{"../../mat/functions/traverse.js":35}],24:[function(require,module,exports){
'use strict'

let Circle       = require('../../geometry/classes/circle.js');
let ContactPoint = require('../../mat/classes/contact-point.js');
let LinkedLoop   = require('../../linked-loop/linked-loop.js');
let MatCircle    = require('../../mat/classes/mat-circle.js');
let Shape        = require('../../geometry/classes/shape.js');
let PointOnShape = require('../../geometry/classes/point-on-shape.js');

/**
 * Adds a 2-prong contact circle to the shape.
 * 
 * @param shape Shape to add the 2-prong to
 * @param circle Circle containing the 2 contact points
 * @param {ListNode} cp1 - First point
 * @param {PointOnShape} pos2 - Second point
 * @param delta The boundary piece within which the new contact point should be placed
 */
function add2Prong(shape, circle, pos1, pos2, holeClosing) {

	if (holeClosing) {
		pos1.order2 = 1;
		pos2.order2 = -1;
	}
	
	let cp2 = new ContactPoint(pos2, undefined);
	let delta2 = Shape.getNeighbouringPoints(shape, pos2); 
	let cmp3 = delta2[0] === undefined ? undefined : ContactPoint.compare(delta2[0].item, cp2); 
	let cmp4 = delta2[1] === undefined ? undefined : ContactPoint.compare(cp2, delta2[1].item);
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
		if (cmp3 > 0 || cmp4 > 0) {
			//console.log(`2-PRONG 2 Order is wrong 2: ${cmp3}, ${cmp4}`);
		}
	}
	if (cmp3 === 0 || cmp4 === 0) {
		// Should not really be possible with hole-closing 2-prongs.
		return undefined;
	}
	let k2 = pos2.bezierNode.loop.indx;
	let newCp2Node = LinkedLoop.insert(
			shape.contactPointsPerLoop[k2],  
			cp2, 
			delta2[0]
	);
	
	
	let cp1 = new ContactPoint(pos1, undefined);
	let delta1 = Shape.getNeighbouringPoints(shape, pos1);
	let cmp1 = delta1[0] === undefined ? undefined : ContactPoint.compare(delta1[0].item, cp1);
	let cmp2 = delta1[1] === undefined ? undefined : ContactPoint.compare(cp1, delta1[1].item);
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
		if (cmp1 > 0 || cmp2 > 0) {
			//console.log(`2-PRONG 1 Order is wrong 2: ${cmp1}, ${cmp2}`);
		}
	}
	// If they are so close together, don't add it - there's already 1
	if (cmp1 === 0 || cmp2 === 0) {
		// Should not be possible with hole-closing 2-prongs.
		LinkedLoop.remove(shape.contactPointsPerLoop[k2], newCp2Node);
		return undefined;
	}
	let k1 = pos1.bezierNode.loop.indx;
	let newCp1Node = LinkedLoop.insert(
			shape.contactPointsPerLoop[k1],  
			cp1, 
			delta1[0]
	);
	
	let matCircle = MatCircle.create(circle, [newCp1Node, newCp2Node]);
	
	newCp1Node.prevOnCircle = newCp2Node;
	newCp1Node.nextOnCircle = newCp2Node;

	newCp2Node.prevOnCircle = newCp1Node;
	newCp2Node.nextOnCircle = newCp1Node;
	
	
	if (holeClosing) {
		let posA1 = pos2;
		let posB2 = PointOnShape.copy(posA1);
		posB2.order2 = 1;
		let cpB2 = new ContactPoint(posB2, undefined);
		let newCpB2Node = LinkedLoop.insert(
				shape.contactPointsPerLoop[k2],  
				cpB2, 
				newCp2Node
		);
		
		
		let posA2 = pos1;
		let posB1 = PointOnShape.copy(posA2);
		posB1.order2 = -1;
		let cpB1 = new ContactPoint(posB1, undefined);
		let newCpB1Node = LinkedLoop.insert(
				shape.contactPointsPerLoop[k1],  
				cpB1, 
				newCp1Node.prev
		);
		
		
		MatCircle.create(circle, [newCpB1Node, newCpB2Node]);
		
		newCpB1Node.prevOnCircle = newCpB2Node;
		newCpB1Node.nextOnCircle = newCpB2Node;
		newCpB2Node.prevOnCircle = newCpB1Node;
		newCpB2Node.nextOnCircle = newCpB1Node;
		
		newCp2Node.next = newCp1Node;
		newCp1Node.prev = newCp2Node;
		
		newCpB1Node.next = newCpB2Node;
		newCpB2Node.prev = newCpB1Node;
	}
	
	
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
		// Add points so when we alt-click shape point is logged.
		prepForDebug(newCp1Node);
		prepForDebug(newCp2Node);
	}
	
	return;
}


function prepForDebug(contactPoint) {
	//---- Prepare debug info for the ContactPoint
	let cpKey = PointOnShape.makeSimpleKey(
			contactPoint.item.pointOnShape
	);
	let cpHash = MatLib._debug_.generated.cpHash;
	let cpArr = MatLib._debug_.generated.cpArr;
	if (!cpHash[cpKey]) {
		cpHash[cpKey] = {
			cp: contactPoint,
			arrIndx: cpArr.length	
		};
		cpArr.push(contactPoint);
	}	
	
	let cpHashDebugObj = cpHash[cpKey];
	
	cpHashDebugObj.visitedPointsArr = 
		cpHashDebugObj.visitedPointsArr || [];
}


module.exports = add2Prong;

},{"../../geometry/classes/circle.js":5,"../../geometry/classes/point-on-shape.js":6,"../../geometry/classes/shape.js":7,"../../linked-loop/linked-loop.js":13,"../../mat/classes/contact-point.js":18,"../../mat/classes/mat-circle.js":21}],25:[function(require,module,exports){
let MatCircle    = require('../../mat/classes/mat-circle.js');
let ContactPoint = require('../../mat/classes/contact-point.js');
let LinkedLoop   = require('../../linked-loop/linked-loop.js');

/**
 * Adds a 3-prong MAT circle according to the 3 given 
 * (previously calculated) points on the shape. 
 * 
 * @param shape
 * @param circle
 * @param [p1,p2,p3]
 * @param deltas
 * @returns {MatCircle} matCircle
 */
function add3Prong(shape, threeProng) {
	
	let { circle, ps, delta3s } = threeProng;

	let cps = [0,1,2].map(i => new ContactPoint(ps[i], undefined))
	
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
		// Keep for possible future debugging.
		/*
		for (let i=0; i<3; i++) {
			let cmpBef = ContactPoint.compare(delta3s[i][0].item, cps[i]);
			let cmpAft = ContactPoint.compare(delta3s[i][1].item, cps[i]); 

			let len = MatLib._debug_.generated.threeProngs.length-1; // Used by debug functions to reference a particular three-prong
			if (cmpBef > 0) {
				console.log(`3-PRONG Order is wrong (bef) : i: ${i} - cmp: ${cmpBef} - n: ${len}`);
				console.log(threeProng);
			}
			if (cmpAft < 0) {
				console.log(`3-PRONG Order is wrong (aft) : i: ${i} - cmp: ${cmpAft} - n: ${len}`);
				console.log(threeProng);
			}
		}
		*/
	}
	
	
	let cpNodes = [];
	for (let i=0; i<3; i++) {
		let pos = ps[i];
		let k = pos.bezierNode.loop.indx;
		cpNodes.push(
			LinkedLoop.insert(
				shape.contactPointsPerLoop[k], 
				cps[i], 
				delta3s[i][0]
			)
		);
	}
	
	
	let matCircle = MatCircle.create(circle, cpNodes);
	
	
	let idxsPrev = [2,0,1];
	let idxsNext = [1,2,0];
	for (let i=0; i<3; i++) {
		cpNodes[i].prevOnCircle = cpNodes[idxsPrev[i]];
		cpNodes[i].nextOnCircle = cpNodes[idxsNext[i]];
	}
	
	return matCircle;
}


module.exports = add3Prong;
},{"../../linked-loop/linked-loop.js":13,"../../mat/classes/contact-point.js":18,"../../mat/classes/mat-circle.js":21}],26:[function(require,module,exports){
'use strict'

let find3Prong   = require('./find-3-prong.js');
let add3Prong    = require('./add-3-prong.js');
let MatNode      = require('../../mat/classes/mat-node.js');
let ContactPoint = require('../../mat/classes/contact-point.js');
let PointOnShape = require('../../geometry/classes/point-on-shape.js');


/**
 * Recursively builds the MAT tree.
 * 
 * @param {ListNode} cpNodeStart
 * @returns {MatNode}
 */
function buildMat(
		shape, cpNodeStart,	fromNode, fromCpNode, isRetry) {
	
	
	let visitedPoints;
	do {
		visitedPoints = traverseShape(cpNodeStart);
		if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
			// Oops - fix
			// cpHashDebugObj.visitedPointsArr.push(visitedPoints);
		}
	
		if (visitedPoints.length > 2) {
			findAndAdd3Prong(shape, visitedPoints);
		}
	} while (visitedPoints.length > 2);
	
	
	if ((cpNodeStart.item.matCircle.cpNodes.length === 1) /*&&
		(fromCpNode.nextOnCircle === cpNodeStart.next)*/) {
		
		 //console.log('terminal 1-prong');
		
		let matNode = createMatNode(
				cpNodeStart, fromNode ? [fromNode] : []
		);
		return matNode;
	} 

	if (visitedPoints.length === 1) {
		// Terminating 2-prong - should mostly have been eliminated
		// by osculating circles and points, but can still occur
		// due to floating point incaccuracies.
		
		// console.log('terminal 2-prong');
		
		let matNode = createMatNode(
				cpNodeStart, fromNode ? [fromNode] : []
		);
		
		return matNode;
	} else if (visitedPoints.length === 2) {
		
		let branches = fromNode ? [fromNode] : [];
		let matNode = createMatNode(
				cpNodeStart, branches
		);
		
		let cpBranches = cpNodeStart;
		let i = 0; 
		while ((cpBranches.nextOnCircle !== cpNodeStart) &&
				cpBranches.next !== cpBranches.nextOnCircle) {
			
			i++;
			
			let cpNext;
			if (i === 1) {
				cpNext = cpBranches.next;	
				cpNodeStart.item.matCircle.visited++;
			} else if (i === 2) {
				// TODO - instead of the commented line below working
				// perfectly, we must call the few lines below it and
				// then later call fixMat. WHY!!!??? does the line
				// below not simply work?
				// cpNext = cpBranches.next;
				cpNext = cpBranches;
				if (cpBranches.item.matCircle.visited !== 1) {
					break;
				}
			}
			
			
			let bm = buildMat(
					shape, 
					cpNext, matNode, cpBranches, 
					false
			);
			
			branches.push( bm );
			
			cpBranches = cpBranches.nextOnCircle;
		}
		
		return matNode;
	}
}


function createMatNode(cp, branches) {
	let matNode = new MatNode(
			cp.item.matCircle,
			branches
	);
	
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) { 
		prepDebugHashes(cp, matNode); 
	}
	
	return matNode;
}


function traverseShape(cpNodeStart) {
	let visitedPoints; 
	let cpNode = cpNodeStart;

	visitedPoints = [];
	do {
		//if ()
		visitedPoints.push(cpNode);
		
		let next = cpNode.next;
		cpNode = next.prevOnCircle; // Take last exit
		
	} while (cpNode !== cpNodeStart); 
	
	return visitedPoints;
}


/**
 * Finds and add a 3-prong MAT circle to the given shape.
 * 
 * @param {Shape} shape
 * @param {ListNode[]} visitedPoints
 * @returns {undefined} 
 * 
 * MODIFIES: shape
 */
function findAndAdd3Prong(shape, visitedPoints) {
	/*
	 * visitedPoints.sort(function(a,b) { return
	 * PointOnShape.compare(a.item.pointOnShape,b.item.pointOnShape); });
	 */
	
	let deltas = [];
	for (let i=0; i<visitedPoints.length; i++) {
		let visitedPoint = visitedPoints[i];
		deltas.push([visitedPoint, visitedPoint.next]);
	}
	
	// Check if any deltas are continuous (they should rather be
	// disjoint). It should be quite safe to consider points 'equal'
	// if they are within a certain threshold of each other, but is it
	// necessary? Maybe not.
	let continuous = false;
	for (let i=0; i<deltas.length; i++) {
		let idxi = i+1;
		if (idxi === deltas.length) { idxi = 0; }
		
		let endP   = deltas[i][1].item;
		let startP = deltas[idxi][0].item;
		if (ContactPoint.equal(endP, startP)) {
			continuous = true;
			break;
		}
	}
	
	if (continuous) {
		// aaa
	}
	
	let threeProng = find3Prong(shape, deltas);
	
	for (let i=0; i<3; i++) {
		PointOnShape.setPointOrder(
				shape, threeProng.circle, threeProng.ps[i]
		);	
	}
	
	add3Prong(shape, threeProng);
}


function prepDebugHashes(cpNodeStart, matNode) {
	// ---- Prepare debug info for the MatCircle
	let circle = cpNodeStart.item.matCircle.circle;
	let key = PointOnShape.makeSimpleKey(circle.center);
	let nodeHash = MatLib._debug_.generated.nodeHash;
	nodeHash[key] = nodeHash[key] || {};
	nodeHash[key].matNode = matNode;
	
	// ---- Prepare debug info for the ContactPoint
	let cpKey = PointOnShape.makeSimpleKey(
			cpNodeStart.item.pointOnShape
	);
	let cpHash = MatLib._debug_.generated.cpHash;
	let cpArr = MatLib._debug_.generated.cpArr;
	if (!cpHash[cpKey]) {
		cpHash[cpKey] = {
			cp: cpNodeStart,
			arrIndx: cpArr.length	
		};
		cpArr.push(cpNodeStart);
	}
	
	let cpHashDebugObj = cpHash[cpKey];
	cpHashDebugObj.visitedPointsArr = 
		cpHashDebugObj.visitedPointsArr || [];
}


module.exports = buildMat;
},{"../../geometry/classes/point-on-shape.js":6,"../../mat/classes/contact-point.js":18,"../../mat/classes/mat-node.js":22,"./add-3-prong.js":25,"./find-3-prong.js":29}],27:[function(require,module,exports){
'use strict'

let MatNode = require('../../mat/classes/mat-node.js');
let Mat     = require('../classes/mat.js');


function copyMat(mat) {
	return new Mat( MatNode.copy(mat.startNode) );
}


module.exports = copyMat;
},{"../../mat/classes/mat-node.js":22,"../classes/mat.js":23}],28:[function(require,module,exports){
'use strict'

const MAX_ITERATIONS = 50;
//TODO Change tolerances to take shape dimension into 
// account, e.g. shapeDim / 10000 for SEPERATION_TOLERANCE;
//CONST SEPERATION_TOLERANCE = 1e-3;
const SEPERATION_TOLERANCE = 1e-3;
const SQUARED_SEPERATION_TOLERANCE = 
		SEPERATION_TOLERANCE * SEPERATION_TOLERANCE;
const _1PRONG_TOLERANCE = 1e-4;
const SQUARED_1PRONG_TOLERANCE = 
		_1PRONG_TOLERANCE * _1PRONG_TOLERANCE;

//const ERROR_TOLERANCE = 1e-3;
const ERROR_TOLERANCE = SEPERATION_TOLERANCE / 10;
const SQUARED_ERROR_TOLERANCE = 
		ERROR_TOLERANCE * ERROR_TOLERANCE;

let MAT_CONSTANTS    = require('../../mat-constants.js');

let Circle       = require('../../geometry/classes/circle.js');
let Bezier       = require('../../geometry/classes/bezier.js');
let Geometry     = require('../../geometry/geometry.js');
let Shape        = require('../../geometry/classes/shape.js');
let LinkedLoop   = require('../../linked-loop/linked-loop.js');
let Vector       = require('../../vector/vector.js');
let PointOnShape = require('../../geometry/classes/Point-on-shape.js');
let ContactPoint = require('../../mat/classes/contact-point.js');
let MatCircle    = require('../../mat/classes/mat-circle.js');

let getClosestBoundaryPointToPoint = 
	require('../../geometry/functions/get-closest-boundary-point-to-point.js');
let TwoProngForDebugging = require('../classes/debug/two-prong-for-debugging.js');


/**
 * Adds a 2-prong to the MAT. The first point is given and the second
 * one is found by the algorithm.
 * 
 * A 2-prong is a MAT circle that touches the shape in 2 points.
 * 
 * @param shape
 * @param {PointOnShape} y - The first point of the 2-prong.
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
function find2Prong(shape, y, holeClosing) {
	
	/* The failed flag is set if a 2-prong cannot be found. This occurs
	 * when the 2 points are too close together and the 2-prong 
	 * becomes, in the limit, a 1-prong. We do not want these 2-prongs
	 * as they push the floating point precision limits when finding
	 * their circle center causing too much inaccuracy. Of course, our
	 * entire algorithm's precision is limited by floating point 
	 * doubles.
	 */
	let failed = false;
	
	// The first point on the shape of the 2-prong.
	//let y = pos;
	let bezierNode = y.bezierNode;
	let t = y.t;
	let oCircle = PointOnShape.getOsculatingCircle(y); 
	let x = oCircle.center;
	
	/* 
	 * The shortest distance so far between the first contact point and
	 * the circle center - we require this to get shorter on each 
	 * iteration as convergence occurs. If it does not, oscillation
	 * of the algorithm has occured due to floating point inaccuracy
	 * and the algorithm must terminate.
	 */
	let radius = oCircle.radius;
	let shortestSquaredDistance = radius*radius;
	
	/* The boundary piece that should contain the other point of 
	 * the 2-prong circle. (Defined by start and end points).
	 */
	let δ;
	let bezierPieces;
	let k = y.bezierNode.loop.indx;
	if (holeClosing) {
		bezierPieces = [];
		for (let k2=0; k2<k; k2++) {
			let pieces = Shape.getBoundaryBeziers(shape, k2);
			Array.prototype.push.apply(bezierPieces, pieces);
		}
	} else {
		// TODO - getNeighbouringPoints *can* be eliminated (as with 3-prongs)
		// by keeping track of boundary piece in which it is being searched 
		// - not sure if same can be done with hole-closing 2-prongs.
		let ps = Shape.getNeighbouringPoints(shape, y);
		δ = [ps[0], ps[0]];
		if (!ps[0]) {
			bezierPieces = Shape.getBoundaryBeziers(shape, k);
		} else {
			bezierPieces = Shape.getBoundaryPieceBeziers(δ);	
		}
	}
	
	let xs = []; // Trace the convergence.
	let z;
	let squaredError;
	let i=0;
	do {
		i++

		let r = Vector.squaredDistanceBetween(x, y);
		bezierPieces = cullBezierPieces(bezierPieces, x, r);
	
		z = getClosestBoundaryPointToPoint(
			bezierPieces,
			x,
			bezierNode, 
			t
		);
		
		if (MatLib._debug_ && !MatLib._debug_.config.isTiming) { 
			xs.push({ x, y, z, t });	
		}
		
		let d = Vector.squaredDistanceBetween(x, z);
		if (i === 1 && d+(SQUARED_1PRONG_TOLERANCE) >= r) {
			// It is a 1-prong.
			add1Prong(shape, y); 
			return undefined; 
		}
		
		let squaredChordDistance = Vector.squaredDistanceBetween(y,z);
		if (squaredChordDistance <= SQUARED_SEPERATION_TOLERANCE) {
			failed = true;
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
		
	} while (squaredError > SQUARED_ERROR_TOLERANCE && i < MAX_ITERATIONS);
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) { 
		xs.push({ x, y, z, t });	
	}
	
	if (i === MAX_ITERATIONS) {
		// This is simply a case of convergence being too slow. The
		// gecko, for example, takes a max of 21 iterations.
		//console.log('max')
		failed = true;
	}
	
	
	let circle = new Circle(
			x,
			Vector.distanceBetween(x,z)
	);
	
	PointOnShape.setPointOrder(shape, circle, y);
	PointOnShape.setPointOrder(shape, circle, z);
	

	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) { 
		recordForDebugging(failed, y, circle, y,z, δ, xs, holeClosing);
	}
	
	
	if (failed) {
		//console.log('failed');
		return undefined;
	} 
	
	
	return { circle, z };
}


function add1Prong(shape, pos) {
	if (pos.type === MAT_CONSTANTS.pointType.dull) {
		// This is a 1-prong at a dull corner.
		
		/* TODO IMPORTANT remove this line, uncomment piece below 
		 * it and implement the following strategy to find the 
		 * 3-prongs: if deltas are conjoined due to dull corner, 
		 * split the conjoinment by inserting successively closer 
		 * (binary division) 2-prongs. If a 2-prong actually fails, 
		 * simply remove the 1-prong at the dull corner.
		 * 
		 * In this way **all** terminal points are found, e.g.
		 * zoom in on top left leg of ant.
		 */
		//console.log(posNode);
		//toRemove.push(posNode); /* this */
		
		if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
			// TODO - why would it be NaN in some cases?
			let oCircle = PointOnShape.getOsculatingCircle(pos);
			if (!Number.isNaN(oCircle.center[0])) {
				MatLib._debug_.generated.oneProngsAtDullCorner.push({pos});	
			}
		}
		
		return;
	}
	

	let cp = new ContactPoint(pos, undefined);
	let delta = Shape.getNeighbouringPoints(shape, pos);
	//let cmp1 = ContactPoint.compare(delta[0].item, cp);
	//let cmp2 = ContactPoint.compare(cp, delta[1].item);
	let cmp1 = delta[0] === undefined ? undefined : ContactPoint.compare(delta[0].item, cp);
	let cmp2 = delta[1] === undefined ? undefined : ContactPoint.compare(cp, delta[1].item);
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
		if (cmp1 > 0 || cmp2 > 0) {
			//console.log(`1-PRONG Order is wrong: ${cmp1}, ${cmp2}`);
		}
	}
	// If they are so close together, don't add it - there's already 1
	if (cmp1 === 0 || cmp2 === 0) {
		return;
	}
	let k = pos.bezierNode.loop.indx;
	let newCpNode = LinkedLoop.insert(
			shape.contactPointsPerLoop[k],  
			cp, 
			delta[0]
	);
	
	let matCircle = MatCircle.create(
			//pos.osculatingCircle,
			PointOnShape.getOsculatingCircle(pos),
			[newCpNode]
	);
	
	newCpNode.prevOnCircle = newCpNode;  // Trivial loop
	newCpNode.nextOnCircle = newCpNode;  // ...
	
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
		MatLib._debug_.generated.oneProngs.push({pos});	
	}
	
	return;
}


function recordForDebugging(
		failed, pos, circle, y, z, δ, xs, holeClosing) {
	
	let twoProngForDebugging = new TwoProngForDebugging(
			pos,
			δ,
			y,
			z,
			circle.center,
			circle,
			xs,
			failed,
			holeClosing
	); 
	
	MatLib._debug_.generated.twoProngs.push( twoProngForDebugging );	
}


/**
 * Cull all bezierPieces not within given radius of a given point.
 * 
 * @param {BezierPieces[]} bezierPieces
 * @param {number[]} p
 * @param {number} r
 * @returns {BezierPieces[]}
 */
function cullBezierPieces(bezierPieces, p, rSquared) {
	const CULL_THRESHOLD = 5;
	
	if (bezierPieces.length <= CULL_THRESHOLD) {
		return bezierPieces;
	}
	

	let newPieces = [];
	for (let bezierPiece of bezierPieces) {
		let bezier = bezierPiece.bezierNode.item;
		
		//let rect = bezier.getBoundingBox();
		let rect = Bezier.getBoundingBox(bezier);
		let bd = Geometry.getClosestSquareDistanceToRect(
				rect,
				p
		);
		if (bd <= rSquared + 0.1 /* Make this in relation to shape extents!*/) {
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
},{"../../geometry/classes/Point-on-shape.js":1,"../../geometry/classes/bezier.js":4,"../../geometry/classes/circle.js":5,"../../geometry/classes/shape.js":7,"../../geometry/functions/get-closest-boundary-point-to-point.js":10,"../../geometry/geometry.js":12,"../../linked-loop/linked-loop.js":13,"../../mat-constants.js":16,"../../mat/classes/contact-point.js":18,"../../mat/classes/mat-circle.js":21,"../../vector/vector.js":43,"../classes/debug/two-prong-for-debugging.js":20}],29:[function(require,module,exports){
'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');

let Util          = require('../../util.js');
let Geometry      = require('../../geometry/geometry.js');
let Vector        = require('../../vector/vector.js');

let Circle        = require('../../geometry/classes/circle.js');
let Bezier        = require('../../geometry/classes/bezier.js');
let PointOnShape  = require('../../geometry/classes/point-on-shape.js');
let Shape         = require('../../geometry/classes/shape.js');

let getClosestBoundaryPointToPoint = 
	require('../../geometry/functions/get-closest-boundary-point-to-point.js');
let ThreeProngForDebugging = require('../classes/debug/three-prong-for-debugging.js');


/**
 * Look for a 3-prong from the given walked boundary piece.
 *
 * @param {Shape} shape
 * @param {ContactPoint[][]} δs
 * 
 */ 
function find3Prong(shape, δs) {
	
	let bezierPiecess = δs.map(function(δ) {
		//MatLib._debug_.fs.draw.crossHair(δ[0].item, 'nofill thin50 green', 1.5);
		//MatLib._debug_.fs.draw.crossHair(δ[1].item, 'nofill thin50 green', 1.9);
		//console.log(δ)
		
		return Shape.getBoundaryPieceBeziers(δ);
	});

	
	let candidateThreeProngs = [];

	
	// The best candidate amongst the different 'permutations' of the
	// given δs.
	let threeProng;
	let bestIndx = undefined; 
	let smallestError = Number.POSITIVE_INFINITY;
	for (let i=1; i<δs.length-1; i++) {
		
		let { circle, ps, error } = 
			find3ProngForDelta3s(shape, δs, i, bezierPiecess);
		
		if (MatLib._debug_ && !MatLib._debug_.config.isTiming) { 
			candidateThreeProngs.push({ circle, ps });
		}
		
		if (error < smallestError) {
			smallestError = error;
			
			bestIndx = i-1;
			threeProng = { circle, ps };
		}
	}

	/*
	if (MatLib._debug_ && MatLib._debug_.log) { 
		if (smallestError > 0.01) {
			console.log('%c' + smallestError, 'color: #f00');	
		} else {
			console.log(smallestError);
		} 
	}
	*/

	//if (MatLib._debug_ && MatLib._debug_.log) { console.log('====================='); }
	
	//-------------------------------------
	//---- Add some additional properties
	//-------------------------------------
	let delta3s = [δs[0], δs[bestIndx+1], δs[δs.length-1]];
	threeProng.delta3s = delta3s;
	//-------------------------------------
	
	
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) { 
		let threeProngForDebugging = new ThreeProngForDebugging(
				threeProng,
				δs, 
				bestIndx, 
				candidateThreeProngs
		);
		
		MatLib._debug_.generated.threeProngs.push( threeProngForDebugging ); 
	}
	
	return threeProng;
}


/**
 * Finds a 3-prong using only the 3 given delta's.
 * 
 * @param i - Specific delta indx.
 * @returns {Object}
 */
function find3ProngForDelta3s(
		shape, deltas, idx, bezierPiecess) {
	
	// TODO - Choose a tolerance relative to shape size.
	const TOLERANCE = 1e-7;
	
	let delta3s = [
		deltas[0], 
		deltas[idx], 
		deltas[deltas.length-1]
	];
	
	let bezierPiece3s = [
		bezierPiecess[0], 
		bezierPiecess[idx], 
		bezierPiecess[deltas.length-1]
	];
	

	let ps;
	let circumCenter;
	let ii = 0; // Safeguard
	let x = calcInitial3ProngPoint(shape, delta3s, bezierPiece3s);
	let tolerance = Number.POSITIVE_INFINITY;
	// TODO 10 below is magic, fix or add somewhere as a constant
	while (tolerance > TOLERANCE && ii < 10) { 
		ii++;
		
		ps = getClosestPoints(x, bezierPiece3s);
		circumCenter = Vector.circumCenter(ps);
	
		let vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circumCenter);
		//let vectorToZeroV = calcVectorToZeroV_AlongMedial (x, circumCenter, ps);
		
		let upds = calcBetterX(bezierPiece3s, x, vectorToZeroV);
		x = upds.newX;
		
		let V = Vector.length(vectorToZeroV);
		ps = upds.newPs;
		
		tolerance = Math.abs(V - upds.newV);
	}


	let radius =  
		(Vector.distanceBetween(x, ps[0]) + 
		 Vector.distanceBetween(x, ps[1]) + 
		 Vector.distanceBetween(x, ps[2])) / 3;
	
	let circle = new Circle(x, radius);

	
	
	//-----------------------------------------------------------------
	// Calculate the unit tangent vector at 3-prong circle points -
	// they should be very close to tangent to the boundary piece 
	// tangents at those points (up to sign). Sharp corners are a
	// common special case.
	//-----------------------------------------------------------------
	let totalAngleError = 0;
	for (let i=0; i<3; i++) {
		let p = ps[i];
		//----------------------------
		// Tangent of circle at point
		//----------------------------
		let vv = Vector.toUnitVector( Vector.fromTo(p, x) );
		let v1 = Vector.rotateBy90Degrees( vv );
		
		
		//if (MatLib._debug_ && MatLib._debug_.log) { console.log(p); }
		
		//-----------------------------------
		// Check if point is on dull crorner
		//-----------------------------------
		let key = PointOnShape.makeSimpleKey(p);
		let dullCorner = shape.dullCornerHash[key];
		if (dullCorner) {
			//if (MatLib._debug_ && MatLib._debug_.log) { console.log(dullCorner); }
				
			let tans = dullCorner.tans;
			let perps = tans.map( Vector.rotateBy90Degrees );
				
			
			if (MatLib._debug_ && MatLib._debug_.log) { 
				
				/*
				MatLib._debug_.fs.draw.line(
						[p, Vector.translate(p, perps[0])], 
						'thin10 red'
				);
				MatLib._debug_.fs.draw.line(
						[p, Vector.translate(p, perps[1])], 
						'thin10 red'
				);
				*/
				
			}
			//if (MatLib._debug_ && MatLib._debug_.log) { console.log(perps); }
			if (MatLib._debug_ && MatLib._debug_.log) {
				// The below must be elem [0,1].
				//console.log(Vector.cross( perps[0], perps[1] )); 
			}
			
			let angleError1Pre = Vector.cross( perps[0], vv );
			let angleError2Pre = Vector.cross( vv, perps[1] );
			let angleError1 = Math.asin( angleError1Pre );
			let angleError2 = Math.asin( angleError2Pre );
			
			let angleError = 0;
			if (angleError1 > 0) { angleError += angleError1; }
			if (angleError2 > 0) { angleError += angleError2; }
			
			totalAngleError += angleError;
		} else {
			//---------------------------
			// Tangent of curve at point
			//---------------------------
			let bezier = p.bezierNode.item;
			let v2 = Vector.toUnitVector( Bezier.tangent(bezier)(p.t) );
			
			// Cross is more numerically stable than Vector.dot at angles
			// a multiple of Math.PI **and** is close to the actual angle
			// value and can thus just be added to cone method of looking
			// at tolerance.
			
			// Should be close to zero and is close to the actual angle.
			let cross = Math.abs( Math.asin( Vector.cross(v1, v2) ) );
			
			totalAngleError += cross;
		}		
	}
	//if (MatLib._debug_ && MatLib._debug_.log) { console.log(totalAngleError); }
	
	//-----------------------------------------------------------------
	// Calculate radiusDelta, the difference between the radius and 
	// the closest point to the 3-prong. It should be around 0. If not,
	// this is not a good candidate for the 3-prong.
	//-----------------------------------------------------------------
	let closestDs = [];
	for (let i=0; i<bezierPiecess.length; i++) {
		let p = getClosestBoundaryPointToPoint(
				bezierPiecess[i],
				x,
				undefined, // bezierNode
				undefined // t
		);
		
		closestDs.push( Vector.distanceBetween(p, x) );
	}
	let closestD = Util.min(closestDs);
	let radiusDelta = Math.abs(radius - closestD);
	
	//if (MatLib._debug_ && MatLib._debug_.log) { console.log(radiusDelta); }
	//if (MatLib._debug_ && MatLib._debug_.log) { console.log('---------------------'); }
	//-----------------------------------------------------------------
	
	// TODO Weights still need to be determined
	let W1 = 1;
	let W2 = 1;
	let error = W1*radiusDelta + W2*totalAngleError;

	return { ps, circle, error };
}


let calcVectorToZeroV_StraightToIt = Vector.fromTo;

function calcVectorToZeroV_AlongMedial(circleCenter, ps) {
	let v1 = Vector.fromTo(ps[0], ps[2]); 
	let v2 = [-v1[1], v1[0]]; // Rotate by 90 degrees
	let l1 = Vector.length(Vector.fromTo(x, circleCenter));
	let v3 = Vector.toUnitVector(v2);
	let v4 = Vector.scale(v3, l1);
	/*
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
		MatLib._debug_.fs.draw.line([x, Vector.translate(x,vectorToZeroV)], 'thin10 red');
		MatLib._debug_.fs.draw.line([x, Vector.translate(x,v4)], 'thin10 blue');
	}
	*/
	
	return v4;			
}


/**
 * Find new x and ps that are a better estimate of the 3-prong  
 * circle.
 * 
 * The potential function, V, is defined as the distance to the 
 * actual 3 prong circle center.
 */
function calcBetterX(
		bezierPiece3s, x, vectorToZeroV) {
	
	let V = Vector.length(vectorToZeroV);
	
	let nu = 1;
	let better;
	let newX;
	let newPs;
	let newV;
	let i = 0; // Safeguard
	do { 
		let shift = Vector.scale(vectorToZeroV, nu);
		newX = Vector.translate(x, shift); 
		
		newPs = getClosestPoints(newX, bezierPiece3s);
					
		// Point of zero V
		let newCircleCenter = Vector.circumCenter(newPs); 
		let newVectorToZeroV = Vector.fromTo(newX, newCircleCenter);
		newV = Vector.length(newVectorToZeroV);
		
		better = newV < V;
		
		nu = nu/2;
		
		i++;
	} while (!better && i < 3);

	
	return { newX, newV, newPs } 
}



/**
 * Finds an initial 3-prong circle center point from which to iterate.
 * The point must be within the shape. 
 * 
 * @param {ContactPoint[]} delta3s - The three boundary pieces of which
 *        we need to find the three 3-prong points.
 * @returns {number[]}
 */
function calcInitial3ProngPoint(
		shape, delta3s, bezierPiece3s) {

	// TODO - No need to calculate, we already have this info somewhere.
	let twoProngCircleCenter = 
		Vector.mean([delta3s[0][0].item, delta3s[2][1].item]); 
	let point1 = getClosestBoundaryPointToPoint(
			bezierPiece3s[1],
			twoProngCircleCenter, 
			undefined, // bezierNode
			undefined // t
	);
	
	
	let meanPoints = [
		delta3s[0][0].item, 
		//Vector.mean([delta3s[1][0].item, delta3s[1][1].item]),
		point1,
		delta3s[2][1].item,
	];
	
	
	let p; 
	if (delta3s[0][0].item.pointOnShape.type === 
		MAT_CONSTANTS.pointType.sharp) {
		
		// delta3s start and end at sharp corner.
		// If delta3s start at a sharp corner it will end there also
		// so no need to check for end point as well.
		p = Vector.mean([meanPoints[0], meanPoints[1]]);
	} else {
		p = Vector.circumCenter(meanPoints);
	}
	
	
	if (!Number.isFinite(p[0])) {
		if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
			// TODO - check why this actuall happens sometimes
			//console.log(MatLib._debug_.pointsToNiceStr(meanPoints));
			//console.log(MatLib._debug_.deltasToNiceStr(delta3s));
			//console.log(p, meanPoints);
		}
	}
	if (!Number.isFinite(p[0])) {
		let sames = whichNotSame(meanPoints);
		return Vector.mean([meanPoints[sames[0]], meanPoints[sames[1]]]);
	}
	
	return p;
	
}


function whichNotSame(ps) {
	if (ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1]) {
		return [0,2];
	} else if (ps[1][0] === ps[2][0] && ps[1][1] === ps[2][1]) {
		return [0,2];
	} else if (ps[2][0] === ps[0][0] && ps[2][1] === ps[0][1]) {
		return [1,2];
	};
	
	return []; 
}


function getClosestPoints(x, bezierPiece3s) {

	return bezierPiece3s.map(function(bezierPieces) {
		
		let p = getClosestBoundaryPointToPoint(
				bezierPieces,
				x, 

				undefined, // bezierNode
				undefined // t
		);
		
		return p; 
	});
}


module.exports = find3Prong;


},{"../../geometry/classes/bezier.js":4,"../../geometry/classes/circle.js":5,"../../geometry/classes/point-on-shape.js":6,"../../geometry/classes/shape.js":7,"../../geometry/functions/get-closest-boundary-point-to-point.js":10,"../../geometry/geometry.js":12,"../../mat-constants.js":16,"../../util.js":42,"../../vector/vector.js":43,"../classes/debug/three-prong-for-debugging.js":19}],30:[function(require,module,exports){
'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');

let Mat          = require('../classes/mat.js');
let ContactPoint = require('../classes/contact-point.js');
let LinkedLoop   = require('../../linked-loop/linked-loop.js');
let Circle       = require('../../geometry/classes/circle.js');
let PointOnShape = require('../../geometry/classes/Point-on-shape.js');

let add2Prong    = require('./add-2-prong.js');
let find2Prong   = require('./find-2-prong.js');
let buildMat     = require('./build-mat.js');


/**
 * Find the MAT from the given Shape.
 */
function findMat(shape) {

	findAndAddHoleClosing2Prongs(shape);
	findAndAdd2ProngsOnAllPaths(shape);
	
	if (MatLib._debug_) {
		MatLib._debug_.generated.timing.after2Prongs = 
			performance.now(); 
	}
	
	
	//---- Connect the n-prong centers and add the 3-prongs.
 
	let contactPoints = shape.contactPointsPerLoop[0];
	
	let cpNode = contactPoints.head;
	do {
		if ((cpNode.item.matCircle.cpNodes.length === 2) &&
			!(cpNode.next.prevOnCircle === cpNode)) {
			
			break;
		}
		
		cpNode = cpNode.next;
	} while (cpNode !== contactPoints.head);			


	let cptest = cpNode.prevOnCircle;

	let branchForth = buildMat(
			shape, cptest, undefined, undefined, false
	);
	let branchBack  = buildMat(
			shape, cptest.prevOnCircle,	undefined, undefined, false
	);
	
	branchForth.branches.push(branchBack.branches[0]);
	branchBack.branches[0].branches[0] = branchForth;
	
	let mat = new Mat(branchForth);
	
	if (MatLib._debug_) {
		MatLib._debug_.generated.timing.after3Prongs = 
			performance.now(); 
	}
	
	return fixMat(mat)
}


/**
 * @description Finds and adds two-prongs that removes any holes in the
 * shape.
 * @param shape
 * @returns {undefined}
 */
function findAndAddHoleClosing2Prongs(shape) {
	let extremes = shape.extremes;
	
	for (let k=1; k<extremes.length; k++) {
		
		let extreme = extremes[k];
		//console.log(extreme.p)
		let r = MAT_CONSTANTS.maxOsculatingCircleRadius;
		let p = [extreme.p[0], extreme.p[1] - r];
		let osculatingCircle = new Circle(p, r);
		let posA2 = new PointOnShape(
				extreme.bezierNode, 
				extreme.t, 
				MAT_CONSTANTS.pointType.extreme, 
				0, //order 
				0
		);
		
		// A normal traversal should give (cyclically) A1->A2->B1->B2
		let twoProngInfo = find2Prong(shape, posA2, true);
		let { circle, z } = twoProngInfo;
		let posA1 = z;
		
		let key = PointOnShape.makeSimpleKey(posA2);
		if (shape.straightUpHash[key]) {
			// Skip these when doing normal 2-prong procedure
			shape.skip2ProngHash[key] = posA2;	
		}

		
		add2Prong(shape, circle, posA2, posA1, true);
	}	
}


/** 
 * Add 2 prongs.
 * 
 * See comments on the add2Prong function.
 */ 
function findAndAdd2ProngsOnAllPaths(shape) {
	let for2ProngsArray = shape.for2ProngsArray;
	
	for (let k=0; k<for2ProngsArray.length; k++) {
		let for2Prongs = for2ProngsArray[k];
		
		findAndAdd2Prongs(shape, k, for2Prongs);
	}
}


function findAndAdd2Prongs(shape, k, for2Prongs) {
	let len = for2Prongs.length;
	//let index = indexInterlaced(len); // Keep for debuggin.
	let index = indexLinear(len);

	for (let i=0; i<len; i++) {
		
		let posNode = for2Prongs[index[i]];
		let pos = posNode.item;
		
		let key = PointOnShape.makeSimpleKey(pos);
		if (shape.skip2ProngHash[key]) {
			continue;
		}
		
		let twoProngInfo = find2Prong(shape, pos, false);
		
		if (twoProngInfo) {
			let { circle, z } = twoProngInfo;
			add2Prong(shape, circle, pos, z, false);
		} else {
			// failed
		}
	}
	

	/* 
	 * Don't delete - keep for future debugging.
	 * Check if point orders follow each other - they absolutely must.
	 */
	/* 
	if (MatLib._debug_) {
		let contactPoints = shape.contactPointsPerLoop[k];
		let cpNode = contactPoints.head;
		let first = true;
		let prev = undefined;
		do {
			if (first) {
				first = false;
				prev = cpNode.item;
				cpNode = cpNode.next;
				continue;
			}
		
			let cmp = ContactPoint.compare(prev, cpNode.item);
			if (cmp >= 0) {
				console.log(cmp);	
			}
			
			prev = cpNode.item;
			cpNode = cpNode.next;
		} while (cpNode !== contactPoints.head);
	}
	*/
}


/** 
 * This is unfortunately currently required since I can't get the
 * buildMat recursive algorithm right on the first pass.
 * @param mat
 * @returns {Mat}
 */
function fixMat(mat) {
		
	helper(mat.startNode, undefined);
		
	function helper(matNode, priorNode) {
		
		if (matNode.branches.length === 3 && 
			(matNode.branches[2].matCircle === matNode.matCircle)) {

			let firstRight = matNode.branches[2];
			let secondRight = firstRight.branches[1];
			matNode.branches[2] = secondRight;
			secondRight.branches[0] = matNode;
		}
		
		
		for (let node of matNode.branches) {
			if (node === priorNode) {
				// Don't go back in tracks.
				continue;
			}
			
			helper(node, matNode);
		}
	}
	
	return mat;
}


/**
 * Creates a kind of interlaced index vector, e.g. TODO
 * 
 * @param n
 * @returns {number[]}
 */
/*
function indexInterlaced(n) {
	
	let arr = [];
	helper(0, n, arr);
	
	return arr;
	
	function helper(start, end) {
		
		if (end === start) { 
			return; 
		}
		
		if ((end - start) === 1) {
			arr.push(start);
			return;	
		}
		
		
		let halfway = start + Math.floor((end-start) / 2);
		
		arr.push(halfway);
		helper(start, halfway);
		helper(halfway+1, end);
	}
}
*/
function indexInterlaced(n) {
	
	let source = {};
	let arr = [];
	// l <=> the lowest power of 2 so that 2^l > n
	let l = Math.pow(2, Math.floor(Math.log2(n)));
	
	while (l >= 1) {
		let k = 0;
		while (k < n) {
			if (!source[k]) {
				arr.push(k);
				source[k] = true;
			}
			k = k + l; 
		}
		l = l/2;
	}
	
	return arr;
}


/**
 * Simple linear array indexing.
 * @param n
 * @returns {number[]}
 */
function indexLinear(n) {
	let arr = [];
	for (let i=0; i<n; i++) {
		arr.push(i);
	}
	return arr;
}

module.exports = findMat;
},{"../../geometry/classes/Point-on-shape.js":1,"../../geometry/classes/circle.js":5,"../../linked-loop/linked-loop.js":13,"../../mat-constants.js":16,"../classes/contact-point.js":18,"../classes/mat.js":23,"./add-2-prong.js":24,"./build-mat.js":26,"./find-2-prong.js":28}],31:[function(require,module,exports){
'use strict'

let traverse = require('./traverse.js')

/**
 * @description Returns all the calculated MAT nodes as an array. 
 */
function getNodesAsArray(mat) {
	let nodes = [];
	
	traverse(mat, function(node) {
		nodes.push(node);
	});
	
	return nodes;
}


module.exports = getNodesAsArray;
},{"./traverse.js":35}],32:[function(require,module,exports){
'use strict'

let PointOnShape = require('../../geometry/classes/point-on-shape.js');

let traverse = require('./traverse.js')


function getNodesAsHash(mat) {
	let nodes = {};
	
	traverse(mat, function(node) {
		let key = PointOnShape.makeSimpleKey(
				node.matCircle.circle.center
		);
		nodes[key] = node;
	});
	
	return nodes;
}


module.exports = getNodesAsHash;
},{"../../geometry/classes/point-on-shape.js":6,"./traverse.js":35}],33:[function(require,module,exports){
'use strict'

let Geometry      = require('../../geometry/geometry.js');
let Bezier        = require('../../geometry/classes/bezier.js');
let Vector        = require('../../vector/vector.js');
let Mat           = require('../classes/mat.js');
let MAT_CONSTANTS = require('../../mat-constants.js');

/**
 * Smoothens the given MAT by fitting consecutive node links by
 * lines, quadratic or cubic beziers. 
 */

function smoothen(mat) {
	
	/**
	 * Get the linked contact points. TODO This information to be
	 * stored in the MatCircle in the future then there is no need
	 * to actually search for it! 
	 */
	function getLinkedCps([prevCpNodes, currCpNodes]) {

		for (let i=0; i<prevCpNodes.length; i++) {
			let prevCpNode = prevCpNodes[i];
			
			for (let j=0; j<currCpNodes.length; j++) {
				let currCpNode = currCpNodes[j];
				
				if (prevCpNode.next === currCpNode) {
					return [prevCpNode, currCpNode];
				}	
			}
		}		
	}
	
	
	let lines = [];
	let quads = [];
	let cubes = [];
	
	
	Mat.traverse(mat, function(currNode, prevNode) {
		if (!prevNode) { return; }
		
		let prevMatCircle = prevNode.matCircle;
		let prevCc = prevMatCircle.circle.center;
		let prevCpNodes = prevMatCircle.cpNodes;
		
		let currMatCircle = currNode.matCircle;
		let currCc = currMatCircle.circle.center;
		let currCpNodes = currMatCircle.cpNodes;
		
		let [prevCpNode, currCpNode] = 
			getLinkedCps([prevCpNodes, currCpNodes]);
		
		
		let prevL = getDirectionToNextMatCircle(prevCpNode, prevCc, true);
		let currL = getDirectionToNextMatCircle(currCpNode, currCc, false);
		
		function getDirectionToNextMatCircle(cpNode, circleCenter, isPrev) {
			let cp1 = cpNode.item;
			
			let cp2 = isPrev ? 
				cpNode.nextOnCircle.item: 
				cpNode.prevOnCircle.item;
			
			let vDir;
			if (cp1 !== cp2) {
				// Not a 1-prong.
				let spanner = Vector.fromTo(cp1, cp2);
				vDir = Vector.rotateBy90Degrees(spanner);
			} else {
				if (cp1.pointOnShape.type === MAT_CONSTANTS.pointType.sharp) {
					let bezierNode1;
					let bezierNode2;
					if (cp1.pointOnShape.t === 0) {
						bezierNode1 = cp1.pointOnShape.bezierNode;
						bezierNode2 = cp1.pointOnShape.bezierNode.prev;
					} else if (cp1.pointOnShape.t === 1) {
						bezierNode1 = cp1.pointOnShape.bezierNode.next; 
						bezierNode2 = cp1.pointOnShape.bezierNode;
					}

					let tan1 = Bezier.tangent(bezierNode1.item)(0);
					let tan2 = Vector.reverse(
							Bezier.tangent(bezierNode2.item)(1)
					);
					
					let x = Vector.dot(tan1, tan2);
					// Recall the identities sin(acos(x)) = sqrt(1-x^2),
					// etc. Also recall the half angle formulas. Then 
					// the rotation matrix, R, can be calculated.
					let cosθ = Math.sqrt((1+x)/2); 					
					let sinθ = Math.sqrt((1-x)/2);
					
					vDir = Vector.rotate(tan2, sinθ, cosθ);
				} else {
					vDir = Vector.fromTo(cp1, circleCenter);	
				}
			}
			let v = Vector.translate(
					circleCenter, 
					Vector.toLength(vDir, 1)
			);
			let l = [circleCenter, v];
			
			return l;
		}

		
		let mid = Geometry.lineLineIntersection(prevL, currL);
		let twisted;
		if (mid) {
			let a = Vector.fromTo(prevCc, mid);
			let b = Vector.fromTo(currCc, mid);
			let c = Vector.fromTo(prevCc, currCc);
			
			let dot1 = Vector.dot(a,c);
			let dot2 = Vector.dot(b,c);
			
			twisted = (dot1 < 0 || dot2 > 0);
		}
		 

		if (!mid) {
			lines.push([prevCc, currCc]);
		} else if (twisted) {
			let lp1 = Vector.mean([prevCc,currCc]);
			let vv1 = Vector.fromTo(prevCc,currCc);
			let vvv1 = Vector.rotateBy90Degrees(vv1);
			let lpp1 = Vector.translate(lp1, vvv1);
			let l = [lp1,lpp1];
			let mid1 = Geometry.lineLineIntersection(prevL,l);
			let mid2 = Geometry.lineLineIntersection(currL,l);

			cubes.push([prevCc, mid1, mid2, currCc]);
		} else {
			//console.log(prevCc, mid, currCc);
			quads.push([prevCc, mid, currCc]);
		}
	});
	
	return {
		lines,
		quads,
		cubes,
	}
}


module.exports = smoothen;














},{"../../geometry/classes/bezier.js":4,"../../geometry/geometry.js":12,"../../mat-constants.js":16,"../../vector/vector.js":43,"../classes/mat.js":23}],34:[function(require,module,exports){
'use strict'

let Circle         = require('../../geometry/classes/circle.js');
let copyMat        = require('./copy-mat.js');
let getNodesAsHash = require('./get-nodes-as-hash.js');
let Geometry       = require('../../geometry/geometry.js');
let PointOnShape   = require('../../geometry/classes/point-on-shape.js');
let Mat            = require('../classes/mat.js');


const width  = 1620; // TODO change to actual shape coordinates
const height = 1560; // ...


/**
 * Apply the Scale Axis Transform (SAT) to the MAT.
 * 
 * @param {Mat} mat The Medial Axis Transform (MAT) on which to 
 *        apply the SAT. 
 * @param {number} s The scale factor >= 1 (e.g. 1.3)
 * @returns {Mat}
 */
function toScaleAxis(mat_, s) {
	/*
	 * This algorithm might be made somewhat faster by building tree  
     * to a depth where there is say less than 4 other circles and then 
     * only split the branch once this threshold has been exceeded.
     * 
     * Also, when searching, search only in relevant branches even
     * when circle overlaps more than one group.
	 */
	

	let mat = copyMat(mat_);
	/*
	 * Start with the biggest circle (since it is the most likely
	 * to eclipse other circles), multiply its radius by s and see
	 * which circles are fully contained in it and trim it away in
	 * the MAT tree.
	 */ 
	
	let nodeHash = getNodesAsHash(mat);
	
	let biggest = -Number.POSITIVE_INFINITY;
	let biggestNode;
	for (let key in nodeHash) {
		let node = nodeHash[key]; 
		let r = node.matCircle.circle.radius; 
		if (r > biggest) {
			biggestNode = node;
			biggest = r;
		}
	}
	
	
	let tree = createSpacialTree(s, nodeHash);
	
	if (MatLib._debug_ && !MatLib._debug_.config.isTiming) {
		/*
		if (MatLib._debug_.shouldDrawSATTree) {
			MatLib._debug_.drawSATTree(tree);
		}
		*/
		MatLib._debug_.generated.sat.tree = tree;
	}
	
	// Grab the MAT tree at its biggest node.
	let sat = new Mat(biggestNode);

	let cullHash = {};
	
	// Look at circles in roughly order of size for each tree branch,
	// e.g. circles in branch 5 are always larger than in branches 0
	// to 4.
	traverseSpacialTree(tree, cullem, { s, tree, cullHash });
	
	// We now walk the MAT tree and keep all non-culled nodes and any
	// nodes that have a non-culled node further down the line toward
	// the tree leaves.
	let cullNodes = [];
	cullIt(cullHash, cullNodes, sat.startNode);
	 
	cullTheNodes(cullNodes);
	
	if (MatLib._debug_) {
		MatLib._debug_.generated.timing.afterSat = 
			performance.now(); 
	}
	
	return sat;
}


function addToTree(s, tree, coordinate, limits, node, key, depth) {

	// DEPTH_LIMIT can be anything from 1 to 16, but from 2 to 6 seem 
	// to be the fastest.
	const DEPTH_LIMIT = 6;
	
	
	let circle = node.matCircle.circle; 
	
	let { groups, newLimits } = calcGroups(
			s,
			coordinate, 
			limits, 
			circle
	);
	
	// Create new branch if it does not exist yet.
	if (groups.length === 1 && depth !== DEPTH_LIMIT) {
		let group = groups[0]; 
		
		if (!tree[group]) { tree[group] = {}; }	
		let branch = tree[group];
		
		// Flip coordinates
		let newCoordinate = coordinate ? 0 : 1; 
		addToTree(
				s,
				branch, 
				newCoordinate, 
				newLimits, 
				node, 
				key, 
				depth+1
		);
		
		return;
	}
	
	if (!tree[5]) {	tree[5] = new Map(); }
	let branch = tree[5];
	branch.set(key, node);
}


function createSpacialTree(s, nodeHash) {

	let coordinate = 0;
	let limits = [[0, width], [0, height]];
	
	let tree = {};
	
	for (let key in nodeHash) {
		let node = nodeHash[key];
		
		addToTree(
				s, 
				tree, 
				coordinate, 
				limits, 
				node, 
				key,
				0
		);
	}
	
	return tree;
}


function cullem(node, key, { s, tree, cullHash }) {
	
	if (node.matCircle.circle.radius === 0) {
		return;
	}

	if (cullHash[key]) {
		return;
	}
	
	let cullNodes = getCullNodes(s, tree, node);
	for (let key in cullNodes) {
		if (!cullHash[key]) { 
			cullHash[key] = node;
		} 
	}
}


function traverseSpacialTree(tree, f, extraParams) {
	
	function helper(tree) {
		if (!tree) { return; }
		
		if (tree.size) {
			//for (let i=0; i<tree.length; i++)
			tree.forEach(function(node, key) {
				f(node, key, extraParams);					
			});
			
			return; // Leaf reached 
		}
		
		if (tree[5]) { helper(tree[5]); }
		if (tree[0]) { helper(tree[0]); }
		if (tree[2]) { helper(tree[2]); }
		if (tree[4]) { helper(tree[4]); }
		if (tree[1]) { helper(tree[1]); }
		if (tree[3]) { helper(tree[3]); }
	}
	
	helper(tree);
}


function getCullNodes(s, tree, testNode) {
	
	let c1 = Circle.scale(testNode.matCircle.circle, s);
	
	let cullNodes = {};
	
	let limits = [[0, width], [0, height]];
	let circle = testNode.matCircle.circle;
	helper(tree, 0, limits, 0);
	
	return cullNodes;
	
	
	function cullBranch5(tree) {
		let branch = tree[5];
		if (!branch) { return; }
		
		//console.log(branch);
		branch.forEach(function(node, key) {
			let c2 = Circle.scale(node.matCircle.circle, s);
			if (Circle.engulfsCircle(c1, c2)) {
				cullNodes[key] = node;
				
				branch.delete(key);
			}					
		});
	}

	function helper(tree, coordinate, limits, depth) {
		
		if (limits === null) {
			// If we already reached a circle which spans multiple
			// groups previously, then check all circles in the 
			// tree.
			cullBranch5(tree);
			
			for (let i=0; i<=4; i++) {
				let branch = tree[i];
				if (branch) {
					helper(branch, 0, null, depth+1);
					//helper(branch, newCoordinate, null, depth+1);
				}
			}
			
			return;
		}
		
		let { groups, newLimits } = calcGroups(
				s, 
				coordinate, 
				limits, 
				circle
		);
		
		if (groups.length === 1) {
			cullBranch5(tree);
			
			let group = groups[0];
			let newCoordinate = coordinate ? 0 : 1;
			
			if (group === 1 || group === 3) {
				// One of the higher priority left/top or 
				// right/bottom half groups.
				let branch = tree[group];
				
				if (branch) {
					helper(
							branch, 
							newCoordinate, 
							newLimits, 
							depth+1
					);
				}
			} else {
				// One of the lower priority even 
				// groups (0,2 or 4).
				
				let branches = [];
				branches.push(tree[group]);
				if (group > 0) { branches.push(tree[group-1]); }
				if (group < 4) { branches.push(tree[group+1]); }
				
				for (let branch of branches) {
					if (branch) {
						helper(
								branch, 
								newCoordinate, 
								newLimits, 
								depth+1
						);
					}
				}
			}
			
			return;
		} 
		

		cullBranch5(tree);
		// Circle spans multiple groups at this level of the 
		// tree. Check all circles in all branches.
		for (let i=0; i<=4; i++) {
			let branch = tree[i];
			if (branch) {
				//helper(branch, newCoordinate, null, depth+1);
				helper(branch, 0, null, depth+1);
			}
		}
	}
}


/**
 * @returns {boolean} true if a node should NOT be culled. 
 */		
function cullIt(cullHash, cullNodes, satNode, priorNode) {

	let key = PointOnShape.makeSimpleKey(satNode.matCircle.circle.center);
	
	let anyNotCull = !cullHash[key];

	for (let node of satNode.branches) {
		if (node === priorNode) { continue; }

		if (cullIt(cullHash, cullNodes, node, satNode)) {
			anyNotCull = true;
		}
	}
			
	if (anyNotCull) {
		return true; // Don't cull me
	}
	
	cullNodes.push({ satNode, priorNode });
	
	return false;
}


function cullTheNode(cullNode) {
	let { satNode, priorNode } = cullNode;

	let idx = priorNode.branches.indexOf(satNode);
	if (idx >= 0) {
		priorNode.branches.splice(idx, 1);	
	}
}


function cullTheNodes(cullNodes) {
	for (let node of cullNodes) {
		cullTheNode(node);
	}
}


/**
 * Spacially divide into 5 special groups as follows:
 * 
 *   *******||*******|*******|*******|*******||*******
 * 0 <--------------->
 * 1         <--------------->        
 * 2                 <--------------->
 * 3                         <--------------->
 * 4                                 <--------------->
 * 5 - If the circle does not fall in any of above 5 groups.
 * 
 * Note: In the above, the double pipes denote the limits for
 *       a coordinate, so as can be seen groups 0 and 4 go outside
 *       the limits. Also, groups 1 and 3 are preferred and checked
 *       first. 
 *          
 * @param s Scale parameter, e.g. 1.1
 * @param {number} coordinate - 0 -> horizontal or 1 -> vertical.
 * @param {number[]} limits - The limits within which the circle 
 *        bounds can fall.
 * @param {Circle} circle - The circle to categorize into a group. 
 */
function calcGroups(s, coordinate, limits, circle) {
	
	let limit = limits[coordinate];
	let l1 = limit[0];
	let l2 = limit[1];
	
	// Relevant cut-off lines.
	let q = (l2 - l1) / 4;
	let w = q+q;
	
	// Shift origin
	let r = circle.radius;
	let x = circle.center[coordinate] - l1;
	let x0 = x - (r * s);
	let x1 = x + (r * s); 

	let newLimit = [,];
	let groups = []; // Group to which circle belongs;

	
	/* This was the old method to get groups and newLimit, but it
	 * seems to be only slightly slower so could also be used
	let is = [1,3,0,2,4]; // Groups 1 and 3 takes priority. 
	for (let i=0; i<=4; i++) {
		let q0 = q*(is[i]-1);
		let q1 = q0 + w;
		if (x0 > q0 && x1 <= q1) {
			groups.push(is[i]);
			newLimit = [l1 + q0, l1 + q1];
			break;
		}
	}*/
	
	let qStart = Math.floor(x0/q);
	let qEnd   = Math.floor(x1/q) + 1;
	let qDiff  = qEnd - qStart; 
	
	let group;
	if (qDiff === 1) {
		// If contained in sliver.
		group = (2 * Math.floor(qStart/2)) + 1;
		groups.push(group);
		
		let lowerLimit = l1 + q*(group-1); 
		newLimit = [lowerLimit, lowerLimit + w];			
		
	} else if (qDiff === 2) {
		group = qStart + 1;
		groups.push(group);
		
		let lowerLimit = l1 + q*(group-1); 
		newLimit = [lowerLimit, lowerLimit + w];
	}
	
	let newLimits = [,];
	if (groups.length === 1) {
		let otherCoordinate = coordinate ? 0 : 1; 
		
		newLimits[otherCoordinate] = limits[otherCoordinate];
		newLimits[coordinate] = newLimit;
	} 
	
	return { groups, newLimits };
}


module.exports = toScaleAxis;
},{"../../geometry/classes/circle.js":5,"../../geometry/classes/point-on-shape.js":6,"../../geometry/geometry.js":12,"../classes/mat.js":23,"./copy-mat.js":27,"./get-nodes-as-hash.js":32}],35:[function(require,module,exports){
let PointOnShape = require('../../geometry/classes/point-on-shape.js');

/**
 * Traverses the MAT tree and calls a function on each node. This
 * function must have side effects to be useful.
 * 
 * @param {Mat} mat
 * @returns {undefined}
 */
function traverse(mat, f) {
	
	helper(mat.startNode, undefined, undefined);
	
	function helper(matNode, priorNode/*, priorIndx*/) {
		f(matNode, priorNode/*, priorIndx*/);
		
		//for (let node of matNode.branches) {
		for (let i=0; i<matNode.branches.length; i++) {
			let node = matNode.branches[i];
			if (node === priorNode) {
				// Don't go back in tracks.
				continue;
			}
			
			helper(node, matNode, i);
		}			
	}
}


module.exports = traverse;
},{"../../geometry/classes/point-on-shape.js":6}],36:[function(require,module,exports){
'use strict'

/**
 * Memoization functions
 */
let Memoize = {};

const SUPPORTED = !!(window.Map && window.WeakMap);


let resultsPerF = undefined;
if (SUPPORTED) { 
	resultsPerF = new Map(); 
}


/**
 * NOTE: f must have an arity of 1.
 */
Memoize.m1 = function(f) {
	if (!SUPPORTED) { return f; }
	
	let results = new WeakMap();
	
	return function(param1) {
		let result = results.get(param1);
		if (result !== undefined) {
			//console.log('cache hit');
			return result; 
		}
		//console.log('cache miss');
		
		result = f(param1);
		
		results.set(param1, result);
		return result;
	}
} 


/**
 * 
 */
/*
Memoize.memoized = function(f, key) {
	if (!SUPPORTED) { return undefined; }
	
	let results = resultsPerF.get(f);
	if (results === undefined) {
		results = new WeakMap();
		resultsPerF.set(f, results);
		return undefined;
	}
	return results.get(key);
}
*/


/**
 * 
 */
/*
Memoize.memoize = function(f, key, val) {
	if (!SUPPORTED) { return; }
	
	let results = resultsPerF.get(f);
	if (results === undefined) {
		results = new WeakMap();
		resultsPerF.set(f, results);
	}
	
	results.set(key, val);
}
*/


module.exports = Memoize;

},{}],37:[function(require,module,exports){
'use strict'


/** 
 * The Gaussian Quadrature method to integrate the given
 * function. The integral limits are between 0 and 1.
 * 
 * @param {Number} order Can be 2, 4 or 8. 
 *        Higher values are more accurate. 
 *        
 * See https://en.wikipedia.org/wiki/Gaussian_quadrature
 * See http://pomax.github.io/bezierinfo/#arclength
 * 
 * Notes: 
 * 
 * - A future improvement can be to use the Gauss–Kronrod rules
 * to estimate the error and thus choose a number of constants based
 * on the error and not just thumb-suck.
 * 
 * - In future, the constants can be calculated and cached so we can
 * chooce any number of constants.
 * 
 */

function gaussQuadrature(f, interval, order_) {
	let order = order_ || 16;
	
	let constants = GAUSS_CONSTANTS[order];
	let weights   = constants.weights;
	let abscissas = constants.abscissas;
	let [a, b] = interval;

	let result = 0;
	let m1 = (b - a) / 2;
	let m2 = (b + a) / 2;
	for (let i=0; i<=order-1; i++) {
		result += weights[i] * f(m1*abscissas[i] + m2);
	}	
	
	return m1 * result;
}


//The Gaussian Legendre Quadrature method constants. 
const GAUSS_CONSTANTS = {
	2: { 
		weights: [1, 1], 
		abscissas: [-0.5773502691896257, 0.5773502691896257] 
	},
	4: { 
		weights: [0.6521451548625461, 0.6521451548625461, 
			 0.3478548451374538, 0.3478548451374538], 
		abscissas: [-0.3399810435848563, 0.3399810435848563, 
			 -0.8611363115940526, 0.8611363115940526] 
	},
	8: {
		weights: [0.3626837833783620, 0.3626837833783620, 
			 0.3137066458778873, 0.3137066458778873,
		     0.2223810344533745, 0.2223810344533745, 
		     0.1012285362903763, 0.1012285362903763],
		abscissas: [-0.1834346424956498, 0.1834346424956498, 
			 -0.5255324099163290, 0.5255324099163290,
		     -0.7966664774136267, 0.7966664774136267, 
		     -0.9602898564975363, 0.9602898564975363]
	},
	// Taken from http://keisan.casio.com/exec/system/1330940731
	16: {
		abscissas: [-0.989400934991649932596,
			 -0.944575023073232576078,
			 -0.86563120238783174388,
			 -0.7554044083550030338951,
			 -0.6178762444026437484467,
			 -0.4580167776572273863424,
			 -0.28160355077925891323,
			 -0.0950125098376374401853,
			  0.0950125098376374401853,
			  0.28160355077925891323,
		      0.4580167776572273863424,
			  0.617876244402643748447,
			  0.755404408355003033895,
			  0.8656312023878317438805,
			  0.944575023073232576078,
			  0.989400934991649932596
		],
		weights: [
			  0.0271524594117540948518,
			  0.062253523938647892863,
			  0.0951585116824927848099,
			  0.1246289712555338720525,
			  0.1495959888165767320815,
			  0.169156519395002538189,
			  0.182603415044923588867,
			  0.189450610455068496285,
			  0.1894506104550684962854,
			  0.182603415044923588867,
			  0.1691565193950025381893,
			  0.149595988816576732081,
			  0.124628971255533872053,
			  0.095158511682492784809,
			  0.062253523938647892863,
			  0.027152459411754094852
		]
	}
};


module.exports = gaussQuadrature;




















},{}],38:[function(require,module,exports){
'use strict'

/**
 * Find the cube roots of the given polynomial between 0 and 1.
 * 
 * This code is from the Pomax guide found at
 * https://pomax.github.io/bezierinfo/#extremities
 * Given cubic coordinates {pa, pb, pc, pd} find all
 * roots.
 * 
 * TODO Later to be replaced by a more numerically stable version.
 */ 
function findCubicRoots01(poly) {

	// A real-cuberoots-only function:
	function cuberoot(v) {
		if (v < 0) {
			return -Math.pow(-v, 1/3);
		} 
		return Math.pow(v, 1/3);
	}
	
	function rootFilter01(root) {
		return root >= 0 && root <= 1;
	}
	
	var d = poly[0];
	var a = poly[1] / d;
	var b = poly[2] / d;
	var c = poly[3] / d;
	
	var p = (3*b - a*a)/3,
	p3 = p/3,
	q = (2*a*a*a - 9*a*b + 27*c)/27,
	q2 = q/2,
	discriminant = q2*q2 + p3*p3*p3;

	// and some variables we're going to use later on:
	var u1,v1,root1,root2,root3;

	// three possible real roots:
	if (discriminant < 0) {
		var mp3  = -p/3,
		mp33 = mp3*mp3*mp3,
		r    = Math.sqrt( mp33 ),
		t    = -q / (2*r),
		cosphi = t<-1 ? -1 : t>1 ? 1 : t,
				phi  = Math.acos(cosphi),
				crtr = cuberoot(r),
				t1   = 2*crtr;
		root1 = t1 * Math.cos(phi/3) - a/3;
		root2 = t1 * Math.cos((phi+2*Math.PI)/3) - a/3;
		root3 = t1 * Math.cos((phi+4*Math.PI)/3) - a/3;
		return [root1, root2, root3].filter(rootFilter01);
	} else if(discriminant === 0) {
		// three real roots, but two of them are equal:
		u1 = q2 < 0 ? cuberoot(-q2) : -cuberoot(q2);
		root1 = 2*u1 - a/3;
		root2 = -u1 - a/3;
		return [root1, root2].filter(rootFilter01);
	} else {
		// one real root, two complex roots
		var sd = Math.sqrt(discriminant);
		u1 = cuberoot(sd - q2);
		v1 = cuberoot(sd + q2);
		root1 = u1 - v1 - a/3;
		return [root1].filter(rootFilter01);
	}
}


module.exports = findCubicRoots01;
},{}],39:[function(require,module,exports){
'use strict'

let Util             = require('../util.js');
let findCubicRoots01 = require('./functions/find-cubic-roots.js'); 


/**
* Functional univariate polynomial library functions.
*
* All polinomials are represented as a simple array starting with the 
* highest power, e.g. 
*   10x^4 + 3x^3 + 5x^2 + 7x + 0 -> [10,3,5,7,0]
*/
let Poly = {
	// Roots
	findQuadraticRoots01,
	findCubicRoots01,
	brent,
	positiveRootLowerBound,
	positiveRootUpperBound,
	zeroRoots,
	numRootsWithin,
	allRoots01,
	newton,
	rootsWithin,
	
	// Operators
	multiplyByConst,
	negate,
	minus,
	multiply,
	differentiate,
	sturmChain,
	degree,
	evaluate,
	evaluateAt0,
	signChanges,
	invert,
	changeVariables,
	deflate,
	
	remainder, 
};



/**  
 * Differentiation the given polynomial.
 **/
function differentiate(p) {
	
	let result = [];
	
	let d = p.length - 1;
	for (let i=d; i !== 0; i--) {
		let coeff = p[d-i] * i;
		if (i === d && coeff === 0) { 
			continue; 
		}
		
		result.push(coeff);
	}
	
	if (result.length === 0) { 
		return [0];
	}
	
	return result;
}


/** 
 * Multiplies 2 polynomials 
 */
function multiplyByConst(c, p) {
	if (c === 0) { return []; }
	
	let d = p.length - 1;
	let result = [];
	for (let i=d; i >= 0; i--) {
		result.push(c * p[d-i]);
	}
	return result;
};


function negate(poly) {
	return Poly.multiplyByConst(-1, poly);
}


/** 
 * Subtracts second from first polynomial 
 */
// TODO - ugly code - improve
function minus(poly1, poly2) {
	let d1 = poly1.length - 1;
	let d2 = poly2.length - 1;
	let dr = Math.max(d1,d2);
	let result = [];
	for (let i=0; i<dr+1; i++) {
		result.push(0);
	}
	
	for (let i=dr; i >= 0; i--) {
		let v1 = poly1[dr-i];
		let v2 = poly2[dr-i];
		result[dr-i] = (v1 ? v1 : 0) - (v2 ? v2 : 0);  
	}
	
	return result;
}


/** 
 * Multiplies poly1 and poly2 
 * 
 * Inefficient O(n^2) 
 * see https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Polynomial_multiplication
 * 
 **/
function multiply(poly1, poly2) {
	let d1 = poly1.length - 1;
	let d2 = poly2.length - 1;
	let dr = d1+d2;
	let result = [];
	for (let i=0; i<dr+1; i++) {
		result.push(0);
	}
	
	for (let i=d1; i >= 0; i--) {
		for (let j=d2; j >= 0; j--) {
			result[dr-(i+j)] += (poly1[d1-i] * poly2[d2-j]); 				
		}
	}
	return result;
}


/** Returns degree of polynomial **/
// TODO - If leading coefficients are 0 this gives the wrong result
function degree(p) {
	return p.length-1;
}


/** 
 * Evaluates a univariate polynomial using Horner's method  
 * See: https://en.wikipedia.org/wiki/Horner%27s_method 
 **/
function evaluate(p) {
	return function(t) {
		let bn = p[0]; 
		for (let i=1; i<p.length; i++) {
			bn = p[i] + bn*t;
		}
		
		return bn;
	}
};


/** 
 * Evaluates a polynomial at 0 
 * - this is much faster than at an arbitrary point 
 */
function evaluateAt0(p) {
	return p[p.length - 1];
};


/** 
 * Returns the number of sign changes in the polynomial coefficents 
 * when order in descending order; zeros are ignored 
 */
function signChanges(p) {

	let result = 0;
	
	let d = p.length - 1;
	let curSign = 0;
	for (let i=d; i >= 0; i--) {
		let newSign = Math.sign(p[d-i]);
		if (newSign === 0) continue;
		if (curSign !== 0 && curSign !== newSign) {
			result++; 
		}
		curSign = newSign;
	}
	
	return result;
}


/** 
 * Returns the remainder when dividing poly1 by poly2 
 * ASSUMING poly1 is one degree higher than poly2.
 */
// See: https://en.wikipedia.org/wiki/Sturm%27s_theorem
function remainder(p1, p2) {
	//console.log(p1,p2)
	
	let d1 = p1.length - 1;  // Degree of p1
	let d2 = p2.length - 1;  // Degree of p2
	let d = d1 - d2;
	for (let i=0; i<d-1; i++) {
		p2.unshift(0);
	}
	d2 = d1-1;

	let pre1 = (p1[1]/p1[0] - p2[1]/p2[0]);
	let pre2 = p1;
	let pre3 = Poly.multiplyByConst(p1[0]/p2[0], p2);
	let pre4 = Poly.multiply(pre3, [1, pre1]);
	let pre5 = Poly.minus(pre4, pre2);
	
	return pre5.slice(2); 
}


function deflate(poly, root) {
	// Implement as a shortcut (can root === 1 also be a shortcut?)
	if (root === 0) {
		
	} 
	
	let d = poly.length-1;
	let bs = [poly[0]];
	for (let i=1; i<poly.length-1; i++) {
		bs.push(
			poly[i] + root*bs[i-1]
		);
	}

	return bs;
}

/** 
 * Generates a sturm chain for the given polynomial 
 */
function sturmChain(p) {
	let m = []; // Sturm chain
	m.push(p);
	m.push(Poly.differentiate(p));
	
	let i = 1;
	
	while (Poly.degree(m[i]) > 0) {
		m.push(Poly.remainder(m[i-1], m[i]));
		i++;
	}
	
	return m;
}


/** 
 * Returns the number of roots in the interval (a,b) of a 
 * polynomial 
 */ 
function numRootsWithin(p, a, b) {

	let sturmChain = Poly.sturmChain(p);
	let as = sturmChain.map(function(p) {
		return Poly.evaluate(p)(a);
	});
	let bs = sturmChain.map(function(p) {
		return Poly.evaluate(p)(b);
	});
	
	return Poly.signChanges(as) - Poly.signChanges(bs);
}


/** 
 * Newton's method - tuned for polynomials 
 * Currently just doing 10 iterations - only for testing at the
 * moment. 
 */
function newton(p, initialGuess) {
	let dp = Poly.differentiate(p);
	let val = initialGuess;
	for (let i=1; i <= 10; i++){
		val -= Poly.evaluate(p)(val) / Poly.evaluate(dp)(val);
	}
	
	return val;
}


/** 
 * See algoritm 6 - Vigklas
 * Note: Only polynomials that has at least 1 sign change can be 
 *       used in this algorithm. This is not a problem since if 
 *       there are no sign changes then there are no roots! 
 */
function positiveRootUpperBound(p) {
	let deg = p.length-1;
	if (deg < 1) { return 0; }
	
	if (p[0] < 0) { p = Poly.negate(p); }
	
	let timesUsed = [];
	for (let i=0; i<deg; i++) {
		timesUsed.push(1);
	}
	
	let ub = 0;
	
	for (let m=0; m<=deg; m++) {
		if (p[m] >= 0) continue;
		
		let tempub = Number.POSITIVE_INFINITY;
		let any = false;
		
		for (let k=0; k<m; k++) {
			if (p[k] <= 0) continue;
		
			// TODO - Both these pows can easily be replaced with a lookup that will speed things up a lot
			// since (for low order polys) it will most of the time be a square, cube... root or multiplication by 1,2,4,8,...
			// TODO - not 100% sure the timesUsed[k] is used correctly here but seems to give reasonable results
			let temp = Math.pow(-p[m] / (p[k] / Math.pow(2, timesUsed[k])), 1/(m-k));
			
			timesUsed[k]++;
			
			if (tempub > temp) { tempub = temp; }
			
			any = true;
		}
		
		if (any && ub < tempub)  
			ub = tempub;
	}
	
	return ub;
}


/**
 * p(x) -> x^deg(p) * p(1/x)
 */
function invert(p) {
	let len = p.length;
	let newP = [];
	
	for (let i=len-1; i>=0; i--) {
		newP.push(p[i]);
	}
	
	return newP;
}


/** 
 * See http://stackoverflow.com/questions/141422/how-can-a-transform-a-polynomial-to-another-coordinate-system 
 * This is basically just a change of variables (type of Mobius transform) of the type: 
 *   p(x) <- p(ax + b)
 * Currently limited to degree 6 or so (due to binomial coeff lookup), but easiliy extensible to any degree with 1 line of code :)
 * 
 * We let the coefficients of p(ax + b) =def= d_i in the code below. d_i is calculated as d = T*c, where c is the original coefficients 
 **/
function changeVariables(p, a, b) {
	let deg = p.length-1;
	
	
	let d = new Array(deg+1).fill(0);
	//let d = [];
	// TODO - better way to fill a matrix with zeros?
	let t = [];
	for (let i=0; i<deg+1; i++) {
		t.push(new Array(deg+1).fill(0));
		//d.push(0);
		/*t.push([]);
		for (let j=0; j<deg+1; j++) {
			t[i].push(0);
		}*/
	}

	
	// Calculate the triangular matrix T
	t[0][0] = 1;
	for (let j=1; j<=deg; j++) {
		t[0][j] = b*t[0][j-1];
		for (let i=1; i<=j; i++) {
			t[i][j] = b*t[i][j-1] + a*t[i-1][j-1];
		}
	}
	
	// Multiply
	for (let i=0; i<=deg; i++) {
		d[deg-i] = 0;
		for (let j=i; j<=deg; j++) {
			let acc = t[i][j] * p[deg-j];
			d[deg-i] += acc;
		}
	}
	
	return d;
}


function positiveRootLowerBound(p) {
	return 1 / (Poly.positiveRootUpperBound(Poly.invert(p)));
}


/**
 * @return {Object} The number of zero roots together with the 
 * deflated polynomial
 *       
 */
function zeroRoots(p) {
	let p_ = p.slice();
	let i = 0;
	while (Poly.evaluateAt0(p_) === 0) {
		let len = p_.length;
		p_.splice(len-1, 1);
		i++;
	}
	return {
		p: p_,
		numZeros: i,
	}	
}



/**
 * Find 2nd order or higher polynomial roots within the 
 * *specific interval** [0,1]. 
 */
function allRoots01(poly) {

	let deg = poly.length-1;
	
	if (deg === 2) {
		return Poly.findQuadraticRoots01(poly); 
	} else if (deg === 3) {
		return Poly.findCubicRoots01(poly).sort(function(a,b) {
			return a - b;
		});
	}
	
	
	let diff = Poly.differentiate(poly); 
	let roots = allRoots01(diff);
	if (roots[0] !== 0) {
		roots.unshift(0);
	}
	if (roots[roots.length-1] !== 1) {
		roots.push(1);
	}
	
	return rootsWithin(poly, roots);
}


function rootsWithin(poly, intervals) {

	let len = intervals.length;
	let roots = [];
	let peval = Poly.evaluate(poly);
	
	for (let i=0; i<len-1; i++) {
		let a = intervals[i];
		let b = intervals[i+1];
		
		let evA = peval(a);
		let evB = peval(b);
		
		if (evA === 0 || evB === 0) {
			if (evA === 0) { roots.push(a);	}
			if (evB === 0) { roots.push(b); }
			
			return roots;
		}
		
		
		let sgn = evA / evB; 
		if (sgn < 0) {
			let root = Poly.brent(peval, a, b);
			roots.push(root);
		} 
	}
	
	return roots;	
}


/**
 * Returns <em>ordered</em> quadratic roots.
 */
function findQuadraticRoots01(q) {
	if (q.length === 0) {
		return undefined;
	}
	if (q.length === 1) {
		if (q[0] === 0) { return []; }
		return [];
	}
	if (q.length === 2) {
		if (q[0] === 0) {
			if (q[1] === 0) { return []; } 
			return []; 
		}
		let root = -q[1]/q[0];
		if (root >= 0 && root <= 1) {
			return [root];	
		}
		return [];
	}
	if (q.length > 3) {
		// TODO Can we safely throw and stay optimized?
		return undefined; 
	}
	
	let [a,b,c] = q;
	
	let root1;
	let root2;
	let delta = b*b - 4*a*c;
	if (delta < 0) {
		// No real roots;
		return []; 
	} 
	if (delta === 0) {
		root1 = -b / (2*a);
		if (root1 >= 0 && root1 <= 1) {
			return [root1];
		} else {
			return [];
		}
	}
	delta = Math.sqrt(delta);
	if (b >= 0) {
		root1 = (-b - delta) / (2*a);
		root2 = (2*c) / (-b - delta);
	} else {
		root1 = (2*c) / (-b + delta);
		root2 = (-b + delta) / (2*a);
	}
	
	let root1InRange = (root1 >= 0 && root1 <= 1); 
	let root2InRange = (root2 >= 0 && root2 <= 1);
	if (root1InRange) {
		if (root2InRange) {
			if (root1 < root2) { 
				return [root1, root2];	
			}
			return [root2, root1];
		}
		return [root1];
	}
	if (root2InRange) {
		return [root2];
	}
	return [];
}


/**
 * Searches the interval from the given lower limit to the given 
 * upper limit for a root (i.e., zero) of the given function with 
 * respect to its first argument using the Brent's Method 
 * root-finding algorithm.
 * 
 * See: https://en.wikipedia.org/wiki/Brent%27s_method
 *
 * @param {Function} f function for which the root is sought.
 * @param {Number} a the lower point of the interval to be searched.
 * @param {Number} b the upper point of the interval to be searched.
 * @param {Number} errorTol the desired accuracy (convergence tolerance).
 * @return An estimate for the root within accuracy.
 * 
 * NOTE: Brent's Method is optimized for general functions. A more 
 * specialzed algorithm targeted at polynomials using for example a
 * combination of the Secant and Newton methods might be much faster. 
 */
let TOLERANCE = 1e-15;
function brent(f, a, b, errorTol) {
	if (a === b) { return a; } // Root already found
	
	let fa = f(a);
	let fb = f(b);
    
    if (fa*fb >= 0) {
    	// Root is not bracketed - this is a precondition.
    	throw 'Root not bracketed'; 
    } 
    
    let c;
    if (Math.abs(fa) < Math.abs(fb)) { 
    	// Swap a,b
    	c = a;  a = b;  b = c;
    }
    
    c = a;
    
    let mflag = true;
    let i = 0;

    
    let prevError;
    while (true) {
    	i++;
    	
    	let fc = f(c);
    	let s;
    	
    	fa = f(a);
    	fb = f(b);
    	
    	if (fa !== fc && fb !== fc) {
    		// Inverse quadratic interpolation
    		let fac = fa - fc;
    		let fab = fa - fb;
    		let fbc = fb - fc;
    		
    		// The below has been multiplied out to speed up the algorithm.
    		/*s = ((a * fb * fc) / ( fab * fac)) +
    			((b * fa * fc) / (-fab * fbc)) +
    			((c * fa * fb) / ( fac * fbc));*/
    		s = ((a*fb*fbc - b*fa*fac)*fc + c*fa*fab*fb) / (fab*fac*fbc);
    	} else {
    		// Secant method
    		s = b - (fb * ((b-a)/(fb-fa)));
    	}
    	
    	let d;
    	let t1 = (3*a + b) / 4;
    	let b_c = Math.abs(b-c);
    	let s_b = Math.abs(s-b);
    	let c_d = Math.abs(c-d);
    	//let tol1 = Math.abs(b-c); 
    	//let tol2 = Math.abs(c-d);
    	
    	if (
    		(!( // s < t1 || s > b
    			(s > t1 && s < b) ||
    			(s < t1 && s > b)
    		)) || // condition 1
    		(mflag && ( 
    			(s_b >= b_c/2) || // condition 2
    			(/*tol1*/b_c < errorTol) // condition 4
    		)) || 
    		(!mflag && (
    			(s_b >= c_d/2) || // condition 3
    			(/*tol2*/c_d < errorTol) // condition 5
    		))
    	) {
    		// Bisection method
    		s = (a + b) / 2;
    		mflag = true;
    	} else {
    		mflag = false;
    	}
    	
    	let fs = f(s);
    	
    	d = c;
    	c = b;
    	
    	if (fa*fs < 0) { b = s; } else { a = s; }
    	
    	if (Math.abs(fa) < Math.abs(fb)) { 
    		// Swap a,b
    		let t3 = a;  a = b;  b = t3;
    	}
	    
    	
	    if (fb === 0) { // or fs === 0
	    	return b; // or return s!; can be used to select side!  
	    } else if (fs === 0) {
	    	return s;
	    }

	    let error = Math.abs(a - b);
	    if ((error/a + error/b) < TOLERANCE || error === 0 ||
	    	prevError <= error) {
	    	return b; // or return s!; can be used to select side!
	    }
	    prevError = error; 
	    
	    /*
	    if (error < errorTol) {
	    	return b; // or return s!; can be used to select side!
	    }*/
    }
}


module.exports = Poly;




// 1052 - 675 - 

},{"../util.js":42,"./functions/find-cubic-roots.js":38}],40:[function(require,module,exports){
'use strict'

// @info
//   Polyfill for SVG 2 getPathData() and setPathData() methods. Based on:
//   - SVGPathSeg polyfill by Philip Rogers (MIT License)
//     https://github.com/progers/pathseg
//   - SVGPathNormalizer by Tadahisa Motooka (MIT License)
//     https://github.com/motooka/SVGPathNormalizer/tree/master/src
//   - arcToCubicCurves() by Dmitry Baranovskiy (MIT License)
//     https://github.com/DmitryBaranovskiy/raphael/blob/v2.1.1/raphael.core.js#L1837
// @author
//   Jarosław Foksa
// @license
//   MIT License

function svgGetAndSetPathDataPolyFill() {
	
	if (!SVGPathElement.prototype.getPathData || 
		!SVGPathElement.prototype.setPathData) {
		
		applyPolyFill();
	}
}


function applyPolyFill() {
	  
	let commandsMap = {
   		Z:"Z", M:"M", L:"L", C:"C", Q:"Q", A:"A", H:"H", V:"V", S:"S", T:"T",
   		z:"Z", m:"m", l:"l", c:"c", q:"q", a:"a", h:"h", v:"v", s:"s", t:"t"
    };
	
    let Source = function(string) {
    	this._string = string;
    	this._currentIndex = 0;
    	this._endIndex = this._string.length;
    	this._prevCommand = null;
    	this._skipOptionalSpaces();
    };
	
    let isIE = window.navigator.userAgent.indexOf("MSIE ") !== -1;
	
    Source.prototype = {
    	parseSegment: function() {
	    		var char = this._string[this._currentIndex];
	    		var command = commandsMap[char] ? commandsMap[char] : null;
	
	    		if (command === null) {
	    			// Possibly an implicit command. Not allowed if this is the first command.
	    			if (this._prevCommand === null) {
	    				return null;
    			}
    			// Check for remaining coordinates in the current command.
	    		if ((char === "+" || char === "-" || char === "." || 
	    			(char >= "0" && char <= "9")) && 
	    			this._prevCommand !== "Z") {
	    			
	    			if (this._prevCommand === "M") {
	    					command = "L";
	    			} else if (this._prevCommand === "m") {
	    				command = "l";
	    			} else {
	    				command = this._prevCommand;
	    			}
	    		} else {
	    			command = null;
	    		}
	
	    		if (command === null) {
	    			return null;
	    		}
	        } else {
	        	this._currentIndex++;
	        }
	
	        this._prevCommand = command;
	
	        var values = null;
	        var cmd = command.toUpperCase();
	
	        if (cmd === "H" || cmd === "V") {
	          values = [this._parseNumber()];
	        } else if (cmd === "M" || cmd === "L" || cmd === "T") {
	          values = [this._parseNumber(), this._parseNumber()];
	        } else if (cmd === "S" || cmd === "Q") {
	          values = [this._parseNumber(), this._parseNumber(), this._parseNumber(), this._parseNumber()];
	        } else if (cmd === "C") {
	        	values = [
	        		this._parseNumber(),
	        		this._parseNumber(),
	        		this._parseNumber(),
	        		this._parseNumber(),
	        		this._parseNumber(),
	        		this._parseNumber()
	        	];
	        } else if (cmd === "A") {
	        	values = [
	        		this._parseNumber(),
	        		this._parseNumber(),
	        		this._parseNumber(),
	        		this._parseArcFlag(),
	        		this._parseArcFlag(),
	        		this._parseNumber(),
	        		this._parseNumber()
	        	];
	        } else if (cmd === "Z") {
	        	this._skipOptionalSpaces();
	        	values = [];
	        }
	
	        if (values === null || values.indexOf(null) >= 0) {
	        	// Unknown command or known command with invalid values
	        	return null;
	        } else {
	        	return { type: command, values };
	        }
	      },
	
	      hasMoreData: function() {
	        return this._currentIndex < this._endIndex;
	      },
	
	      peekSegmentType: function() {
	        var char = this._string[this._currentIndex];
	        return commandsMap[char] ? commandsMap[char] : null;
	      },
	
	      initialCommandIsMoveTo: function() {
	        // If the path is empty it is still valid, so return true.
	        if (!this.hasMoreData()) {
	          return true;
	        }
	
	        var command = this.peekSegmentType();
	        // Path must start with moveTo.
	        return command === "M" || command === "m";
	      },
	
	      _isCurrentSpace: function() {
	        var char = this._string[this._currentIndex];
	        return char <= " " && (char === " " || char === "\n" || char === "\t" || char === "\r" || char === "\f");
	      },
	
	      _skipOptionalSpaces: function() {
	        while (this._currentIndex < this._endIndex && this._isCurrentSpace()) {
	          this._currentIndex += 1;
	        }
	
	        return this._currentIndex < this._endIndex;
	      },
	
	      _skipOptionalSpacesOrDelimiter: function() {
	        if (
	          this._currentIndex < this._endIndex &&
	          !this._isCurrentSpace() &&
	          this._string[this._currentIndex] !== ","
	        ) {
	          return false;
	        }
	
	        if (this._skipOptionalSpaces()) {
	          if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === ",") {
	            this._currentIndex += 1;
	            this._skipOptionalSpaces();
	          }
	        }
	        return this._currentIndex < this._endIndex;
	      },
	
	      // Parse a number from an SVG path. This very closely follows genericParseNumber(...) from
	      // Source/core/svg/SVGParserUtilities.cpp.
	      // Spec: http://www.w3.org/TR/SVG11/single-page.html#paths-PathDataBNF
	      _parseNumber: function() {
	        var exponent = 0;
	        var integer = 0;
	        var frac = 1;
	        var decimal = 0;
	        var sign = 1;
	        var expsign = 1;
	        var startIndex = this._currentIndex;
	
	        this._skipOptionalSpaces();
	
	        // Read the sign.
	        if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === "+") {
	          this._currentIndex += 1;
	        }
	        else if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === "-") {
	          this._currentIndex += 1;
	          sign = -1;
	        }
	
	        if (
	          this._currentIndex === this._endIndex ||
	          (
	            (this._string[this._currentIndex] < "0" || this._string[this._currentIndex] > "9") &&
	            this._string[this._currentIndex] !== "."
	          )
	        ) {
	          // The first character of a number must be one of [0-9+-.].
	          return null;
	        }
	
	        // Read the integer part, build right-to-left.
	        var startIntPartIndex = this._currentIndex;
	
	        while (
	          this._currentIndex < this._endIndex &&
	          this._string[this._currentIndex] >= "0" &&
	          this._string[this._currentIndex] <= "9"
	        ) {
	          this._currentIndex += 1; // Advance to first non-digit.
	        }
	
	        if (this._currentIndex !== startIntPartIndex) {
	          var scanIntPartIndex = this._currentIndex - 1;
	          var multiplier = 1;
	
	          while (scanIntPartIndex >= startIntPartIndex) {
	            integer += multiplier * (this._string[scanIntPartIndex] - "0");
	            scanIntPartIndex -= 1;
	            multiplier *= 10;
	          }
	        }
	
	        // Read the decimals.
	        if (this._currentIndex < this._endIndex && this._string[this._currentIndex] === ".") {
	          this._currentIndex += 1;
	
	          // There must be a least one digit following the .
	          if (
	            this._currentIndex >= this._endIndex ||
	            this._string[this._currentIndex] < "0" ||
	            this._string[this._currentIndex] > "9"
	          ) {
	            return null;
	          }
	
	          while (
	            this._currentIndex < this._endIndex &&
	            this._string[this._currentIndex] >= "0" &&
	            this._string[this._currentIndex] <= "9"
	          ) {
	            decimal += (this._string[this._currentIndex] - "0") * (frac *= 0.1);
	            this._currentIndex += 1;
	          }
	        }
	
	        // Read the exponent part.
	        if (
	          this._currentIndex !== startIndex &&
	          this._currentIndex + 1 < this._endIndex &&
	          (this._string[this._currentIndex] === "e" || this._string[this._currentIndex] === "E") &&
	          (this._string[this._currentIndex + 1] !== "x" && this._string[this._currentIndex + 1] !== "m")
	        ) {
	          this._currentIndex += 1;
	
	          // Read the sign of the exponent.
	          if (this._string[this._currentIndex] === "+") {
	            this._currentIndex += 1;
	          }
	          else if (this._string[this._currentIndex] === "-") {
	            this._currentIndex += 1;
	            expsign = -1;
	          }
	
	          // There must be an exponent.
	          if (
	            this._currentIndex >= this._endIndex ||
	            this._string[this._currentIndex] < "0" ||
	            this._string[this._currentIndex] > "9"
	          ) {
	            return null;
	          }
	
	          while (
	            this._currentIndex < this._endIndex &&
	            this._string[this._currentIndex] >= "0" &&
	            this._string[this._currentIndex] <= "9"
	          ) {
	            exponent *= 10;
	            exponent += (this._string[this._currentIndex] - "0");
	            this._currentIndex += 1;
	          }
	        }
	
	        var number = integer + decimal;
	        number *= sign;
	
	        if (exponent) {
	          number *= Math.pow(10, expsign * exponent);
	        }
	
	        if (startIndex === this._currentIndex) {
	          return null;
	        }
	
	        this._skipOptionalSpacesOrDelimiter();
	
	        return number;
	      },
	
	      _parseArcFlag: function() {
	        if (this._currentIndex >= this._endIndex) {
	          return null;
	        }
	
	        var flag = null;
	        var flagChar = this._string[this._currentIndex];
	
	        this._currentIndex += 1;
	
	        if (flagChar === "0") {
	          flag = 0;
	        }
	        else if (flagChar === "1") {
	          flag = 1;
	        }
	        else {
	          return null;
	        }
	
	        this._skipOptionalSpacesOrDelimiter();
	        return flag;
	      }
	    };
	
	    var parsePathDataString = function(string) {
	      if (!string || string.length === 0) return [];
	
	      var source = new Source(string);
	      var pathData = [];
	
	      if (source.initialCommandIsMoveTo()) {
	        while (source.hasMoreData()) {
	          var pathSeg = source.parseSegment();
	
	          if (pathSeg === null) {
	            break;
	          }
	          else {
	            pathData.push(pathSeg);
	          }
	        }
	      }
	
	      return pathData;
	    }
	
	    var setAttribute = SVGPathElement.prototype.setAttribute;
	    var removeAttribute = SVGPathElement.prototype.removeAttribute;
	    var symbols;
	
	    if (window.Symbol) {
	      symbols = {cachedPathData: Symbol(), cachedNormalizedPathData: Symbol()};
	    }
	    else {
	      symbols = {cachedPathData: "__cachedPathData", cachedNormalizedPathData: "__cachedNormalizedPathData"};
	    }
	
	    // @info
	    //   Get an array of corresponding cubic bezier curve parameters for given arc curve paramters.
	    var arcToCubicCurves = function(x1, y1, x2, y2, r1, r2, angle, largeArcFlag, sweepFlag, _recursive) {
	      var degToRad = function(degrees) {
	        return (Math.PI * degrees) / 180;
	      };
	
	      var rotate = function(x, y, angleRad) {
	        var X = x * Math.cos(angleRad) - y * Math.sin(angleRad);
	        var Y = x * Math.sin(angleRad) + y * Math.cos(angleRad);
	        return {x: X, y: Y};
	      };
	
	      var angleRad = degToRad(angle);
	      var params = [];
	      var f1, f2, cx, cy;
	
	      if (_recursive) {
	        f1 = _recursive[0];
	        f2 = _recursive[1];
	        cx = _recursive[2];
	        cy = _recursive[3];
	      }
	      else {
	        var p1 = rotate(x1, y1, -angleRad);
	        x1 = p1.x;
	        y1 = p1.y;
	
	        var p2 = rotate(x2, y2, -angleRad);
	        x2 = p2.x;
	        y2 = p2.y;
	
	        var x = (x1 - x2) / 2;
	        var y = (y1 - y2) / 2;
	        var h = (x * x) / (r1 * r1) + (y * y) / (r2 * r2);
	
	        if (h > 1) {
	          h = Math.sqrt(h);
	          r1 = h * r1;
	          r2 = h * r2;
	        }
	
	        var sign;
	
	        if (largeArcFlag === sweepFlag) {
	          sign = -1;
	        }
	        else {
	          sign = 1;
	        }
	
	        var r1Pow = r1 * r1;
	        var r2Pow = r2 * r2;
	
	        var left = r1Pow * r2Pow - r1Pow * y * y - r2Pow * x * x;
	        var right = r1Pow * y * y + r2Pow * x * x;
	
	        var k = sign * Math.sqrt(Math.abs(left/right));
	
	        cx = k * r1 * y / r2 + (x1 + x2) / 2;
	        cy = k * -r2 * x / r1 + (y1 + y2) / 2;
	
	        f1 = Math.asin(((y1 - cy) / r2).toFixed(9));
	        f2 = Math.asin(((y2 - cy) / r2).toFixed(9));
	
	        if (x1 < cx) {
	          f1 = Math.PI - f1;
	        }
	        if (x2 < cx) {
	          f2 = Math.PI - f2;
	        }
	
	        if (f1 < 0) {
	          f1 = Math.PI * 2 + f1;
	        }
	        if (f2 < 0) {
	          f2 = Math.PI * 2 + f2;
	        }
	
	        if (sweepFlag && f1 > f2) {
	          f1 = f1 - Math.PI * 2;
	        }
	        if (!sweepFlag && f2 > f1) {
	          f2 = f2 - Math.PI * 2;
	        }
	      }
	
	      var df = f2 - f1;
	
	      if (Math.abs(df) > (Math.PI * 120 / 180)) {
	        var f2old = f2;
	        var x2old = x2;
	        var y2old = y2;
	
	        if (sweepFlag && f2 > f1) {
	          f2 = f1 + (Math.PI * 120 / 180) * (1);
	        }
	        else {
	          f2 = f1 + (Math.PI * 120 / 180) * (-1);
	        }
	
	        x2 = cx + r1 * Math.cos(f2);
	        y2 = cy + r2 * Math.sin(f2);
	        params = arcToCubicCurves(x2, y2, x2old, y2old, r1, r2, angle, 0, sweepFlag, [f2, f2old, cx, cy]);
	      }
	
	      df = f2 - f1;
	
	      var c1 = Math.cos(f1);
	      var s1 = Math.sin(f1);
	      var c2 = Math.cos(f2);
	      var s2 = Math.sin(f2);
	      var t = Math.tan(df / 4);
	      var hx = 4 / 3 * r1 * t;
	      var hy = 4 / 3 * r2 * t;
	
	      var m1 = [x1, y1];
	      var m2 = [x1 + hx * s1, y1 - hy * c1];
	      var m3 = [x2 + hx * s2, y2 - hy * c2];
	      var m4 = [x2, y2];
	
	      m2[0] = 2 * m1[0] - m2[0];
	      m2[1] = 2 * m1[1] - m2[1];
	
	      if (_recursive) {
	        return [m2, m3, m4].concat(params);
	      }
	      else {
	        params = [m2, m3, m4].concat(params).join().split(",");
	
	        var curves = [];
	        var curveParams = [];
	
	        params.forEach( function(param, i) {
	          if (i % 2) {
	            curveParams.push(rotate(params[i - 1], params[i], angleRad).y);
	          }
	          else {
	            curveParams.push(rotate(params[i], params[i + 1], angleRad).x);
	          }
	
	          if (curveParams.length === 6) {
	            curves.push(curveParams);
	            curveParams = [];
	          }
	        });
	
	        return curves;
	      }
	    };
	
	    var clonePathData = function(pathData) {
	      return pathData.map( function(seg) {
	        return {type: seg.type, values: Array.prototype.slice.call(seg.values)}
	      });
	    };
	
	    // @info
	    //   Takes any path data, returns path data that consists only from absolute commands.
	    var absolutizePathData = function(pathData) {
	      var absolutizedPathData = [];
	
	      var currentX = null;
	      var currentY = null;
	
	      var subpathX = null;
	      var subpathY = null;
	
	      pathData.forEach( function(seg) {
	        var type = seg.type;
	
	        if (type === "M") {
	          var x = seg.values[0];
	          var y = seg.values[1];
	
	          absolutizedPathData.push({type: "M", values: [x, y]});
	
	          subpathX = x;
	          subpathY = y;
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "m") {
	          var x = currentX + seg.values[0];
	          var y = currentY + seg.values[1];
	
	          absolutizedPathData.push({type: "M", values: [x, y]});
	
	          subpathX = x;
	          subpathY = y;
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "L") {
	          var x = seg.values[0];
	          var y = seg.values[1];
	
	          absolutizedPathData.push({type: "L", values: [x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "l") {
	          var x = currentX + seg.values[0];
	          var y = currentY + seg.values[1];
	
	          absolutizedPathData.push({type: "L", values: [x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "C") {
	          var x1 = seg.values[0];
	          var y1 = seg.values[1];
	          var x2 = seg.values[2];
	          var y2 = seg.values[3];
	          var x = seg.values[4];
	          var y = seg.values[5];
	
	          absolutizedPathData.push({type: "C", values: [x1, y1, x2, y2, x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "c") {
	          var x1 = currentX + seg.values[0];
	          var y1 = currentY + seg.values[1];
	          var x2 = currentX + seg.values[2];
	          var y2 = currentY + seg.values[3];
	          var x = currentX + seg.values[4];
	          var y = currentY + seg.values[5];
	
	          absolutizedPathData.push({type: "C", values: [x1, y1, x2, y2, x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "Q") {
	          var x1 = seg.values[0];
	          var y1 = seg.values[1];
	          var x = seg.values[2];
	          var y = seg.values[3];
	
	          absolutizedPathData.push({type: "Q", values: [x1, y1, x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "q") {
	          var x1 = currentX + seg.values[0];
	          var y1 = currentY + seg.values[1];
	          var x = currentX + seg.values[2];
	          var y = currentY + seg.values[3];
	
	          absolutizedPathData.push({type: "Q", values: [x1, y1, x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "A") {
	          var x = seg.values[5];
	          var y = seg.values[6];
	
	          absolutizedPathData.push({
	            type: "A",
	            values: [seg.values[0], seg.values[1], seg.values[2], seg.values[3], seg.values[4], x, y]
	          });
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "a") {
	          var x = currentX + seg.values[5];
	          var y = currentY + seg.values[6];
	
	          absolutizedPathData.push({
	            type: "A",
	            values: [seg.values[0], seg.values[1], seg.values[2], seg.values[3], seg.values[4], x, y]
	          });
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "H") {
	          var x = seg.values[0];
	          absolutizedPathData.push({type: "H", values: [x]});
	          currentX = x;
	        }
	
	        else if (type === "h") {
	          var x = currentX + seg.values[0];
	          absolutizedPathData.push({type: "H", values: [x]});
	          currentX = x;
	        }
	
	        else if (type === "V") {
	          var y = seg.values[0];
	          absolutizedPathData.push({type: "V", values: [y]});
	          currentY = y;
	        }
	
	        else if (type === "v") {
	          var y = currentY + seg.values[0];
	          absolutizedPathData.push({type: "V", values: [y]});
	          currentY = y;
	        }
	
	        else if (type === "S") {
	          var x2 = seg.values[0];
	          var y2 = seg.values[1];
	          var x = seg.values[2];
	          var y = seg.values[3];
	
	          absolutizedPathData.push({type: "S", values: [x2, y2, x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "s") {
	          var x2 = currentX + seg.values[0];
	          var y2 = currentY + seg.values[1];
	          var x = currentX + seg.values[2];
	          var y = currentY + seg.values[3];
	
	          absolutizedPathData.push({type: "S", values: [x2, y2, x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "T") {
	          var x = seg.values[0];
	          var y = seg.values[1]
	
	          absolutizedPathData.push({type: "T", values: [x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "t") {
	          var x = currentX + seg.values[0];
	          var y = currentY + seg.values[1]
	
	          absolutizedPathData.push({type: "T", values: [x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (type === "Z" || type === "z") {
	          absolutizedPathData.push({type: "Z", values: []});
	
	          currentX = subpathX;
	          currentY = subpathY;
	        }
	      });
	
	      return absolutizedPathData;
	    };
	
	    // @info
	    //   Takes path data that consists only from absolute commands, returns path data that consists only from
	    //   "M", "L", "C" and "Z" commands.
	    var reducePathData = function(pathData) {
	      var reducedPathData = [];
	      var lastType = null;
	
	      var lastControlX = null;
	      var lastControlY = null;
	
	      var currentX = null;
	      var currentY = null;
	
	      var subpathX = null;
	      var subpathY = null;
	
	      pathData.forEach( function(seg) {
	        if (seg.type === "M") {
	          var x = seg.values[0];
	          var y = seg.values[1];
	
	          reducedPathData.push({type: "M", values: [x, y]});
	
	          subpathX = x;
	          subpathY = y;
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (seg.type === "C") {
	          var x1 = seg.values[0];
	          var y1 = seg.values[1];
	          var x2 = seg.values[2];
	          var y2 = seg.values[3];
	          var x = seg.values[4];
	          var y = seg.values[5];
	
	          reducedPathData.push({type: "C", values: [x1, y1, x2, y2, x, y]});
	
	          lastControlX = x2;
	          lastControlY = y2;
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (seg.type === "L") {
	          var x = seg.values[0];
	          var y = seg.values[1];
	
	          reducedPathData.push({type: "L", values: [x, y]});
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (seg.type === "H") {
	          var x = seg.values[0];
	
	          reducedPathData.push({type: "L", values: [x, currentY]});
	
	          currentX = x;
	        }
	
	        else if (seg.type === "V") {
	          var y = seg.values[0];
	
	          reducedPathData.push({type: "L", values: [currentX, y]});
	
	          currentY = y;
	        }
	
	        else if (seg.type === "S") {
	          var x2 = seg.values[0];
	          var y2 = seg.values[1];
	          var x = seg.values[2];
	          var y = seg.values[3];
	
	          var cx1, cy1;
	
	          if (lastType === "C" || lastType === "S") {
	            cx1 = currentX + (currentX - lastControlX);
	            cy1 = currentY + (currentY - lastControlY);
	          }
	          else {
	            cx1 = currentX;
	            cy1 = currentY;
	          }
	
	          reducedPathData.push({type: "C", values: [cx1, cy1, x2, y2, x, y]});
	
	          lastControlX = x2;
	          lastControlY = y2;
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (seg.type === "T") {
	          var x = seg.values[0];
	          var y = seg.values[1];
	
	          var x1, y1;
	
	          if (lastType === "Q" || lastType === "T") {
	            x1 = currentX + (currentX - lastControlX);
	            y1 = currentY + (currentY - lastControlY);
	          }
	          else {
	            x1 = currentX;
	            y1 = currentY;
	          }
	
	          var cx1 = currentX + 2 * (x1 - currentX) / 3;
	          var cy1 = currentY + 2 * (y1 - currentY) / 3;
	          var cx2 = x + 2 * (x1 - x) / 3;
	          var cy2 = y + 2 * (y1 - y) / 3;
	
	          reducedPathData.push({type: "C", values: [cx1, cy1, cx2, cy2, x, y]});
	
	          lastControlX = x1;
	          lastControlY = y1;
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (seg.type === "Q") {
	          var x1 = seg.values[0];
	          var y1 = seg.values[1];
	          var x = seg.values[2];
	          var y = seg.values[3];
	
	          var cx1 = currentX + 2 * (x1 - currentX) / 3;
	          var cy1 = currentY + 2 * (y1 - currentY) / 3;
	          var cx2 = x + 2 * (x1 - x) / 3;
	          var cy2 = y + 2 * (y1 - y) / 3;
	
	          reducedPathData.push({type: "C", values: [cx1, cy1, cx2, cy2, x, y]});
	
	          lastControlX = x1;
	          lastControlY = y1;
	
	          currentX = x;
	          currentY = y;
	        }
	
	        else if (seg.type === "A") {
	          var r1 = seg.values[0];
	          var r2 = seg.values[1];
	          var angle = seg.values[2];
	          var largeArcFlag = seg.values[3];
	          var sweepFlag = seg.values[4];
	          var x = seg.values[5];
	          var y = seg.values[6];
	
	          if (r1 === 0 || r2 === 0) {
	            reducedPathData.push({type: "C", values: [currentX, currentY, x, y, x, y]});
	
	            currentX = x;
	            currentY = y;
	          }
	          else {
	            if (currentX !== x || currentY !== y) {
	              var curves = arcToCubicCurves(currentX, currentY, x, y, r1, r2, angle, largeArcFlag, sweepFlag);
	
	              curves.forEach( function(curve) {
	                reducedPathData.push({type: "C", values: curve});
	
	                currentX = x;
	                currentY = y;
	              });
	            }
	          }
	        }
	
	        else if (seg.type === "Z") {
	          reducedPathData.push(seg);
	
	          currentX = subpathX;
	          currentY = subpathY;
	        }
	
	        lastType = seg.type;
	      });
	
	      return reducedPathData;
	    };
	
	    SVGPathElement.prototype.setAttribute = function(name, value) {
	      if (name === "d") {
	        this[symbols.cachedPathData] = null;
	        this[symbols.cachedNormalizedPathData] = null;
	      }
	
	      setAttribute.call(this, name, value);
	    };
	
	    SVGPathElement.prototype.removeAttribute = function(name, value) {
	      if (name === "d") {
	        this[symbols.cachedPathData] = null;
	        this[symbols.cachedNormalizedPathData] = null;
	      }
	
	      removeAttribute.call(this, name);
	    };
	
	    SVGPathElement.prototype.getPathData = function(options) {
	      if (options && options.normalize) {
	        if (this[symbols.cachedNormalizedPathData]) {
	          return clonePathData(this[symbols.cachedNormalizedPathData]);
	        }
	        else {
	          var pathData;
	
	          if (this[symbols.cachedPathData]) {
	            pathData = clonePathData(this[symbols.cachedPathData]);
	          }
	          else {
	            pathData = parsePathDataString(this.getAttribute("d") || "");
	            this[symbols.cachedPathData] = clonePathData(pathData);
	          }
	
	          var normalizedPathData = reducePathData(absolutizePathData(pathData));
	          this[symbols.cachedNormalizedPathData] = clonePathData(normalizedPathData);
	          return normalizedPathData;
	        }
	      }
	      else {
	        if (this[symbols.cachedPathData]) {
	          return clonePathData(this[symbols.cachedPathData]);
	        }
	        else {
	          var pathData = parsePathDataString(this.getAttribute("d") || "");
	          this[symbols.cachedPathData] = clonePathData(pathData);
	          return pathData;
	        }
	      }
	    };
	
	    SVGPathElement.prototype.setPathData = function(pathData) {
	      if (pathData.length === 0) {
	        if (isIE) {
	          // @bugfix https://github.com/mbostock/d3/issues/1737
	          this.setAttribute("d", "");
	        }
	        else {
	          this.removeAttribute("d");
	        }
	      }
	      else {
	        var d = "";
	
	        for (var i = 0, l = pathData.length; i < l; i += 1) {
	          var seg = pathData[i];
	
	          if (i > 0) {
	            d += " ";
	          }
	
	          d += seg.type;
	
	          if (seg.values) {
	            d += " " + seg.values.join(" ");
	          }
	        }
	
	        this.setAttribute("d", d);
	      }
	    };
}

module.exports = svgGetAndSetPathDataPolyFill;

// 1014
},{}],41:[function(require,module,exports){
'use strict'

let Bezier     = require('../geometry/classes/bezier.js'); 
let LinkedLoop = require('../linked-loop/linked-loop.js');
let Geometry   = require('../geometry/geometry.js');
let Vector     = require('../vector/vector.js');
let svgGetAndSetPathDataPolyFill = require('./path-data-polyfill/path-data-polyfill.js');

let Svg = {};

const DELTA = 1e-6; // TODO - must be replaced with value relative to image size.

/**
 * Get the cubic beziers from the given SVG DOM element. If a path
 * data tag is not "C", i.e. if it is not an absolute cubic bezier
 * coordinate then it is converted into one.
 */
Svg.getBeziersFromSvgElem = function(elem) {
	
	function pushBezier(arr, bezierPoints_, j) {
		// TODO 
		// We check if any of the bezierPoints are coincident and thus
		// that the bezier is degenerate in some sense. If that is the
		// case we apply a heuristic to get a new similar bezier by 
		// respacing the points. This entire function is very 
		// convoluted.
		// We should investigate a better mathematical solution.
		
		// Currently if the bezier degenerates more or less into a point
		// we make the next bezier start at the previous bezier's end
		// point else we adjust the bezier to be less pathological.

		let ds = [
			[	
				0,
				Vector.manhattanDistanceBetween(bezierPoints_[0], bezierPoints_[1]),
				Vector.manhattanDistanceBetween(bezierPoints_[0], bezierPoints_[2]),
				Vector.manhattanDistanceBetween(bezierPoints_[0], bezierPoints_[3])
			],
			[
				Vector.manhattanDistanceBetween(bezierPoints_[1], bezierPoints_[0]),
				0,
				Vector.manhattanDistanceBetween(bezierPoints_[1], bezierPoints_[2]),	
				Vector.manhattanDistanceBetween(bezierPoints_[1], bezierPoints_[3]),
			],
			[
				Vector.manhattanDistanceBetween(bezierPoints_[2], bezierPoints_[0]),
				Vector.manhattanDistanceBetween(bezierPoints_[2], bezierPoints_[1]),
				0,	
				Vector.manhattanDistanceBetween(bezierPoints_[2], bezierPoints_[3]),
			],
			[
				Vector.manhattanDistanceBetween(bezierPoints_[3], bezierPoints_[0]),
				Vector.manhattanDistanceBetween(bezierPoints_[3], bezierPoints_[1]),
				Vector.manhattanDistanceBetween(bezierPoints_[3], bezierPoints_[2]),	
				0,
			]
		];
		
		let bezierPoints = bezierPoints_;
		
		const SHIFT = 0.1;
		// Check if first or last 3 points are coincident
		if (ds[0][1] < DELTA && ds[1][2] < DELTA || 
			ds[1][2] < DELTA && ds[2][3] < DELTA) {
			bezierPoints = [
				bezierPoints_[0],
				Vector.interpolate(bezierPoints_[0], bezierPoints_[3], 1/3),
				Vector.interpolate(bezierPoints_[0], bezierPoints_[3], 2/3),
				bezierPoints_[3]
			];
		}
		
		// Check if first 2 points are coincident
		if (ds[0][1] < DELTA) {
			bezierPoints[1] = Vector.interpolate(
					bezierPoints_[0], bezierPoints_[2], SHIFT
			); 	
		}
		
		// Check if last 2 points are coincident
		if (ds[2][3] < DELTA) {
			bezierPoints[2] = Vector.interpolate(
					bezierPoints_[1], bezierPoints_[3], 1-SHIFT 
			); 	
		}
		
		// Check if middle 2 points are coincident
		if (ds[1][2] < DELTA) {
			bezierPoints[1] = Vector.interpolate(
					bezierPoints_[0], bezierPoints_[1], 1-SHIFT 
			); 	
			bezierPoints[2] = Vector.interpolate(
					bezierPoints_[2], bezierPoints_[3], SHIFT 
			);
		}
		
		
		arr.push(new Bezier(bezierPoints, j));
	}
	
	
	const MUST_START_WITH_M = 
		'Invalid SVG - every new path must start with an M or m.';
	const INVALID_COMMAND = 
		'Invalid SVG - command not recognized.'
	
	svgGetAndSetPathDataPolyFill(); // Ensure polyfill is applied.

	var paths = elem.getPathData();  
	
	//console.log(paths);
	
	if (paths.length < 2) {
		// A shape is not described   
		return []; 
	}
	

	let pathStarted = false;

	// Used in conjunction with "S" and "s"
	let prev2ndCubicControlPoint = undefined;
	let prev2ndQuadraticControlPoint = undefined;
	
	let bezierArrays = [];
	let bezierArray = [];
	//let j = 0;
	let j;
	let type = undefined;
	let initialPoint = undefined;
	let x0 = undefined;
	let y0 = undefined;
	for (var i=0; i<paths.length; i++) {
		let path = paths[i];
		let vals = path.values;
		

		let addX = 0;
		let addY = 0;
		if (path.type == path.type.toLowerCase()) {
			addX = x0;
			addY = y0;
		}
		let prevType = type;
		type = path.type.toUpperCase();
		
		let bezierPoints;
		switch (type) {
			/* 
			 * M and m: (from www.w3.org) 
			 * --------------------------
			 * Start a new sub-path at the given (x,y) coordinate. 
			 * M (uppercase) indicates that absolute coordinates will 
			 * follow; m (lowercase) indicates that relative coordinates 
			 * will follow. If a moveto is followed by multiple pairs of 
			 * coordinates, the subsequent pairs are treated as implicit 
			 * lineto commands. Hence, implicit lineto commands will be 
			 * relative if the moveto is relative, and absolute if the 
			 * moveto is absolute. If a relative moveto (m) appears as the 
			 * first element of the path, then it is treated as a pair of 
			 * absolute coordinates. In this case, subsequent pairs of 
			 * coordinates are treated as relative even though the initial 
			 * moveto is interpreted as an absolute moveto. 
			 */
			case 'M': {
				// Note: A valid SVG path must start with "M" or "m".
				
				if (pathStarted) {
					// This is a subpath, close as if a Z or z was the
					// previous command.
					if (prevType !== 'Z') {
						let xInterval = (vals[0] + addX - x0)/3;
						let yInterval = (vals[1] + addY - y0)/3;
						bezierPoints = [
							[x0, y0],
							[x0 + xInterval*1, y0 + yInterval*1],
							[x0 + xInterval*2, y0 + yInterval*2],
							[x0 + xInterval*3, y0 + yInterval*3]
						];
						prev2ndCubicControlPoint = undefined;
						prev2ndQuadraticControlPoint = undefined;
						
						if ( !isCloseToOrigin([xInterval, yInterval]) ) {
							//bezierArray.push( new Bezier(bezierPoints, j++) );
							pushBezier(bezierArray, bezierPoints, j++);
						}
					}
				}
				
				if (bezierArray.length) {
					bezierArrays.push(bezierArray);
					bezierArray = [];
				}
				
				pathStarted = true;
				
				// Update current point
				x0 = vals[0];
				y0 = vals[1];
				
				// Update initial point of current path/sub-path.
				initialPoint = [x0, y0];
				
				j = 0;
				
				break;
			}
		
			/* 
			 * C and c: (from www.w3.org) 
			 * params: x1 y1 x2 y2 x y
			 * --------------------------
			 * Draws a cubic Bézier curve from the current point to (x,y) 
			 * using (x1,y1) as the control point at the beginning of the 
			 * curve and (x2,y2) as the control point at the end of the 
			 * curve. C (uppercase) indicates that absolute coordinates 
			 * will follow; c (lowercase) indicates that relative 
			 * coordinates will follow. Multiple sets of coordinates may 
			 * be specified to draw a polybézier. At the end of the 
			 * command, the new current point becomes the final (x,y) 
			 * coordinate pair used in the polybézier.
			 */
			case 'C': { 
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				bezierPoints = [
					[x0, y0],
					[addX + vals[0], addY + vals[1]],
					[addX + vals[2], addY + vals[3]],
					[addX + vals[4], addY + vals[5]]
				];
				prev2ndCubicControlPoint = bezierPoints[2];
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if ( !isAlmostZeroLength(bezierPoints) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
				}
				
				break;
			}
			/* 
			 * S and s: (from www.w3.org) 
			 * params: x2 y2 x y
			 * --------------------------
			 * Draws a cubic Bézier curve from the current point to 
			 * (x,y). The first control point is assumed to be the 
			 * reflection of the second control point on the previous 
			 * command relative to the current point. (If there is no 
			 * previous command or if the previous command was not an 
			 * C, c, S or s, assume the first control point is 
			 * coincident with the current point.) (x2,y2) is the 
			 * second control point (i.e., the control point at the end 
			 * of the curve). S (uppercase) indicates that absolute 
			 * coordinates will follow; s (lowercase) indicates that 
			 * relative coordinates will follow. Multiple sets of 
			 * coordinates may be specified to draw a polybézier. 
			 * At the end of the command, the new current point becomes 
			 * the final (x,y) coordinate pair used in the polybézier.
			 */
			case 'S': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let x1;
				let y1;
				if (prev2ndCubicControlPoint) {
					x1 = (x0 - prev2ndCubicControlPoint[0]) + x0; 
					y1 = (y0 - prev2ndCubicControlPoint[1]) + y0;
				} else {
					x1 = x0;
					y1 = y0;
				}
				bezierPoints = [
					[x0, y0],
					[x1, y1],
					[addX + vals[0], addY + vals[1]],
					[addX + vals[2], addY + vals[3]]
				];
				prev2ndCubicControlPoint = bezierPoints[2];
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if ( !isAlmostZeroLength(bezierPoints) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
				}
				
				break;
			}
			/* 
			 * L and l: (from www.w3.org)
			 * params: x y 
			 * --------------------------
			 * Draw a line from the current point to the given (x,y) 
			 * coordinate which becomes the new current point. L 
			 * (uppercase) indicates that absolute coordinates will 
			 * follow; l (lowercase) indicates that relative 
			 * coordinates will follow. A number of coordinates pairs 
			 * may be specified to draw a polyline. At the end of the 
			 * command, the new current point is set to the final set 
			 * of coordinates provided.
			 */	
			case 'L': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let xInterval = (vals[0] + addX - x0)/3;
				let yInterval = (vals[1] + addY - y0)/3;
				bezierPoints = [
					[x0, y0],
					[x0 + xInterval*1, y0 + yInterval*1],
					[x0 + xInterval*2, y0 + yInterval*2],
					[x0 + xInterval*3, y0 + yInterval*3]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if ( !isCloseToOrigin([xInterval, yInterval]) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
				}
				
				break;
			}
				
			/* 
			 * H and h: (from www.w3.org) 
			 * params: x
			 * --------------------------
			 * Draws a horizontal line from the current point (cpx, cpy) 
			 * to (x, cpy). H (uppercase) indicates that absolute 
			 * coordinates will follow; h (lowercase) indicates that 
			 * relative coordinates will follow. Multiple x values can 
			 * be provided (although usually this doesn't make sense). 
			 * At the end of the command, the new current point becomes 
			 * (x, cpy) for the final value of x.
			 */	
			case 'H': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let xInterval = (vals[0] + addX - x0)/3;
				bezierPoints = [
					[x0, y0],
					[x0 + xInterval*1, y0],
					[x0 + xInterval*2, y0],
					[x0 + xInterval*3, y0]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if (Math.abs(xInterval) > DELTA) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
				}
				
				break;
			}
				
			/* 
			 * V and v: (from www.w3.org) 
			 * params: y
			 * --------------------------
			 * Draws a vertical line from the current point (cpx, cpy) 
			 * to (cpx, y). V (uppercase) indicates that absolute 
			 * coordinates will follow; v (lowercase) indicates that 
			 * relative coordinates will follow. Multiple y values can 
			 * be provided (although usually this doesn't make sense). 
			 * At the end of the command, the new current point becomes 
			 * (cpx, y) for the final value of y.
			 */
			case 'V': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let yInterval = (vals[1] + addY - y0)/3;
				bezierPoints = [
					[x0, y0],
					[x0, y0 + yInterval*1],
					[x0, y0 + yInterval*2],
					[x0, y0 + yInterval*3]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if (Math.abs(yInterval) > DELTA) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
				}
				
				break;
			}
				
			/* 
			 * Q and q: (from www.w3.org) 
			 * params: x1 y1 x y
			 * --------------------------
			 * Draws a quadratic Bézier curve from the current point to 
			 * (x,y) using (x1,y1) as the control point. Q (uppercase) 
			 * indicates that absolute coordinates will follow; q 
			 * (lowercase) indicates that relative coordinates will 
			 * follow. Multiple sets of coordinates may be specified 
			 * to draw a polybézier. At the end of the command, the new 
			 * current point becomes the final (x,y) coordinate pair 
			 * used in the polybézier.
			 */
			case 'Q': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				//---------------------------------------------------
				// Convert quadratic to cubic
				// see https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic/3162732#3162732
				//---------------------------------------------------
				
				let QP0 = [x0, y0];
				let QP1 = [addX + vals[0], addY + vals[1]];
				let QP2 = [addX + vals[2], addY + vals[3]];
				
				
				// Endpoints stay the same
				let CP0 = QP0;
				let CP3 = QP2;
				
				// CP1 = QP0 + 2/3 *(QP1-QP0)
				let CP1 = [
					QP0[0] + (2/3)*(QP1[0]-QP0[0]), 
					QP0[1] + (2/3)*(QP1[1]-QP0[1])
				];
				// CP2 = QP2 + 2/3 *(QP1-QP2)
				let CP2 = [
					QP2[0] + (2/3)*(QP1[0]-QP2[0]), 
					QP2[1] + (2/3)*(QP1[1]-QP2[1])
				];
				
				bezierPoints = [CP0, CP1, CP2, CP3];
				
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = QP1;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if ( !isAlmostZeroLength(bezierPoints) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
				}
				
				break;
			}
				
			/* 
			 * T and t: (from www.w3.org) 
			 * params: x y
			 * --------------------------
			 * Draws a quadratic Bézier curve from the current point to 
			 * (x,y). The control point is assumed to be the reflection 
			 * of the control point on the previous command relative to 
			 * the current point. (If there is no previous command or if 
			 * the previous command was not a Q, q, T or t, assume the 
			 * control point is coincident with the current point.) T 
			 * (uppercase) indicates that absolute coordinates will 
			 * follow; t (lowercase) indicates that relative coordinates 
			 * will follow. At the end of the command, the new current 
			 * point becomes the final (x,y) coordinate pair used in the 
			 * polybézier.
			 */
			case 'T': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				let x1;
				let y1;
				if (prev2ndQuadraticControlPoint) {
					x1 = (x0 - prev2ndQuadraticControlPoint[0]) + x0; 
					y1 = (y0 - prev2ndQuadraticControlPoint[1]) + y0;
				} else {
					x1 = x0;
					y1 = y0;
				}
			
				//---------------------------------------------------
				// Convert quadratic to cubic
				// see https://stackoverflow.com/questions/3162645/convert-a-quadratic-bezier-to-a-cubic/3162732#3162732
				//---------------------------------------------------
				
				let QP0 = [x0, y0];
				let QP1 = [x1, y1];
				let QP2 = [addX + vals[0], addY + vals[1]];
				
				
				// Endpoints stay the same
				let CP0 = QP0;
				let CP3 = QP2;
				
				// CP1 = QP0 + 2/3 *(QP1-QP0)
				let CP1 = [
					QP0[0] + (2/3)*(QP1[0]-QP0[0]), 
					QP0[1] + (2/3)*(QP1[1]-QP0[1])
				];
				// CP2 = QP2 + 2/3 *(QP1-QP2)
				let CP2 = [
					QP2[0] + (2/3)*(QP1[0]-QP2[0]), 
					QP2[1] + (2/3)*(QP1[1]-QP2[1])
				];
				
				bezierPoints = [CP0, CP1, CP2, CP3];
				
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = QP1;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];
				
				if ( !isAlmostZeroLength(bezierPoints) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
				}
				
				break;
			}
				
			/* 
			 * A and a: (from www.w3.org) 
			 * params: rx ry x-axis-rotation large-arc-flag 
			 *         sweep-flag x y
			 * --------------------------------------------
			 * Draws an elliptical arc from the current point to (x, y). 
			 * The size and orientation of the ellipse are defined by 
			 * two radii (rx, ry) and an x-axis-rotation, which 
			 * indicates how the ellipse as a whole is rotated relative 
			 * to the current coordinate system. The center (cx, cy) of 
			 * the ellipse is calculated automatically to satisfy the 
			 * constraints imposed by the other parameters. 
			 * large-arc-flag and sweep-flag contribute to the automatic 
			 * calculations and help determine how the arc is drawn.
			 */
			case 'A': {
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
			
				prev2ndCubicControlPoint = undefined; 
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				//x0 = ? bezierPoints[3][0]; 
				//y0 = ? bezierPoints[3][1];
				
				//bezierArray.push( new Bezier(bezierPoints, j++) );
				pushBezier(bezierArray, bezierPoints, j++);
				
				break;
			}				
				
			/* 
			 * Z and z: (from www.w3.org) 
			 * params: (none)
			 * --------------------------
			 * Close the current subpath by drawing a straight line 
			 * from the current point to current subpath's initial 
			 * point. Since the Z and z commands take no parameters, 
			 * they have an identical effect.
			 */
			case 'Z':
				if (!pathStarted) { throw new Error(MUST_START_WITH_M); }
				
				let xInterval = (initialPoint[0] + addX - x0)/3;
				let yInterval = (initialPoint[1] + addY - y0)/3;
				
				bezierPoints = [
					[x0, y0],
					[x0 + xInterval*1, y0 + yInterval*1],
					[x0 + xInterval*2, y0 + yInterval*2],
					[x0 + xInterval*3, y0 + yInterval*3]
				];
				prev2ndCubicControlPoint = undefined;
				prev2ndQuadraticControlPoint = undefined;
				
				// Update current point
				x0 = bezierPoints[3][0]; 
				y0 = bezierPoints[3][1];

				
				if ( !isCloseToOrigin([xInterval, yInterval]) ) {
					//bezierArray.push( new Bezier(bezierPoints, j++) );
					pushBezier(bezierArray, bezierPoints, j++);
				}
				
				break;
				
			default: 
				throw new Error(INVALID_COMMAND);
		}
	}


	if (bezierArray.length) {
		bezierArrays.push(bezierArray);
		bezierArray = [];
	}
	
	return bezierArrays;
}


/**
 * Check if distance between consecutive points are somewhere not 
 * relatively 'very small'.
 * @param points
 * @returns {boolean}
 */
function isAlmostZeroLength(ps) {
	return false;
	
	for (let i=1; i<ps.length; i++) {
		let p1 = ps[i-1];
		let p2 = ps[i];
		
		if (Vector.manhattanDistanceBetween(p1, p2) > DELTA) {
			return false; 
		}
	}
	
	return true;
}


/**
 * @param point
 * @returns {boolean}
 */
// TODO - we can use Manhattan distance in many places instead of 
// Euclidian distance (much faster and simpler to calculate)
function isCloseToOrigin(p) {
	return Vector.manhattanLength(p) < DELTA;
}


/**
 * Takes the given beziers and creates a path string which will consist
 * only out of 'C' elements. 
 */
Svg.getPathStrFromBezierLoop = function(bezierLoop) {
	const DEC = 10;
	
	let node = bezierLoop.head;
	let isFirst = true;
	let prevPoint = undefined;
	let str = ''; 
	do {
		let points = node.item.bezierPoints;
		
		if (isFirst) {
			isFirst = false;
			str = 'M ' + 
				points[0][0].toFixed(DEC) + ' ' + 
				points[0][1].toFixed(DEC) + '\n';
			prevPoint = points[0];
		}
		
		str += 'C ' + 
			points[1][0].toFixed(DEC) + ' ' + 
			points[1][1].toFixed(DEC) + ' ' +
			points[2][0].toFixed(DEC) + ' ' + 
			points[2][1].toFixed(DEC) + ' ' +
			points[3][0].toFixed(DEC) + ' ' + 
			points[3][1].toFixed(DEC) + ' ' + '\n';
		
		node = node.next;
	} while (node !== bezierLoop.head);
	
	return str;
}


module.exports = Svg;


















},{"../geometry/classes/bezier.js":4,"../geometry/geometry.js":12,"../linked-loop/linked-loop.js":13,"../vector/vector.js":43,"./path-data-polyfill/path-data-polyfill.js":40}],42:[function(require,module,exports){
'use strict'

/**
 * Utililty class
 */
let Util = {};


/**
 * @description Returns the minimum value in the given array.
 * @sig [number] -> number
 * @param {number[]} xs
 * @returns {number}
 */
Util.min = function(xs) {
	return Math.min.apply(null, xs);
}
	

/**
 * @description Returns the maximum value in the given array.
 * @sig [number] -> number
 * @param {number[]} xs
 * @returns {number}
 */
Util.max = function(xs) {
	return Math.max.apply(null, xs);
}


/**
 * @description Floating-point safer version of acos. If x is larger 
 * than 1 (or smaller than -1), still returns 0 (or Math.PI) instead of 
 * NAN.
 * @sig number -> number
 * @param {number} x
 * @returns {number}
 * @example 
 * 		Util.acos(1);  //=> 0
 *      Util.acos(2);  //=> 0
 */
Util.acos = function(x) {
	if (x > 1) {
		return 0;
	} else if (x < -1) {
		return Math.PI;
	}
	
	return Math.acos(x);
}


module.exports = Util;

},{}],43:[function(require,module,exports){
'use strict'

/*
 * Vector utilities, mostly 2-vectors (represented as arrays).
 */
let Vector = {}


/** 
 * @return The dot (inner) product between 2 2-vectors 
 */
	
Vector.dot = function(a,b) {
	return a[0]*b[0] + a[1]*b[1]; 
}


/** 
 * @return The cross product magnitude between 2 2-vectors 
 */
Vector.cross = function(a,b) {
	return a[0]*b[1] - a[1]*b[0]; 
},


/** 
 * @return {Number} The squared distance between 2 points.
 */
Vector.squaredDistanceBetween = function(p1, p2) {
	var x = p2[0] - p1[0]; 
	var y = p2[1] - p1[1];
	
	return (x*x) + (y*y);
}


Vector.scale = function(p, factor) {
	return [p[0] * factor, p[1] * factor];
}


Vector.reverse = function(p) {
	return [p[0] * -1, p[1] * -1];
}


Vector.toUnitVector = function(p) {
	var scaleFactor = 1 / Vector.length(p);
	
	return [p[0] * scaleFactor, p[1] * scaleFactor];
}


Vector.toLength = function(p, length) {
	var scaleFactor = length / Vector.length(p);
	
	return [p[0]*scaleFactor, p[1]*scaleFactor];
}


/** 
 * @return The vector from one point to another. 
 */
Vector.fromTo = function(p1, p2) {
	return [p2[0] - p1[0], p2[1] - p1[1]];
}


/**
 * @description Performs linear interpolation between two points.
 * @param {Number[]} p1 - The first point.
 * @param {Number[]} p2 - The second point.
 * @param {Number} t - The interpolation fraction (usually in [0,1]).  
 * @returns The interpolated point.
 */
Vector.interpolate = function(p1, p2, t) {
	return [
		p1[0] + (p2[0] - p1[0])*t, 
		p1[1] + (p2[1] - p1[1])*t
	];
}


/** 
 * @param {number[][]} ps 
 * 
 * @return The mean value of the provided array of points.
 */
Vector.mean = function(ps) {
	let p1 = ps[0];
	let p2 = ps[1];
	
	return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
}


/** 
 * @return The distance between 2 points 
 */
Vector.distanceBetween = function(p1, p2) {
	return Math.sqrt(Vector.squaredDistanceBetween(p1, p2));
}


/** 
 * Returns the distance from the origin. 
 */
Vector.length = function(p) {
	return Math.sqrt((p[0]*p[0]) + (p[1]*p[1]));
}


Vector.lengthSquared = function(p) {
	return (p[0]*p[0]) + (p[1]*p[1]);
}


Vector.manhattanDistanceBetween = function(p1, p2) {
	return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);
}


Vector.manhattanLength = function(p) {
	return Math.abs(p[0]) + Math.abs(p[1]);
}


/**
 * @return The distance between the given point and line. 
 * 
 * See https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points 
 */
Vector.distanceBetweenPointAndLine = function(p, l) {
	var x0 = p[0];
	var y0 = p[1];
	var x1 = l[0][0];
	var y1 = l[0][1];
	var x2 = l[1][0];
	var y2 = l[1][1];
	
	var y2_y1 = y2-y1;
	var x2_x1 = x2-x1;
	
	var numerator   = (y2_y1*x0 - x2_x1*y0 + x2*y1 - y2*x1);
	var denominator = Math.sqrt(y2_y1*y2_y1 + x2_x1*x2_x1);
	
	return Math.abs(numerator / denominator);
}


/**
 * @return The distance between the given point and line. 
 */
Vector.squaredDistanceBetweenPointAndLineSegment = function(p, l) {
	var v = l[0];
	var w = l[1];
	
	var l2 = Vector.squaredDistanceBetween(v, w);
	if (l2 == 0) { return Vector.squaredDistanceBetween(p, v); }
	
	var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
	t = Math.max(0, Math.min(1, t));
	
	var d2 = Vector.squaredDistanceBetween(
		p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1]) ]);
	
	return d2;
}


Vector.circumCenter = function(triangle) {
	// See wikipedia
	let p1 = triangle[0];
	let p2 = triangle[1];
	let p3 = triangle[2];
	
	let Sx = 0.5*det3(
			[squaredNorm(p1), p1[1], 1],  
			[squaredNorm(p2), p2[1], 1],
			[squaredNorm(p3), p3[1], 1]
	);
	
	
	let Sy = 0.5*det3(
			[p1[0], squaredNorm(p1), 1],  
			[p2[0], squaredNorm(p2), 1],
			[p3[0], squaredNorm(p3), 1]
	);
	
	let a = det3(
			[p1[0], p1[1], 1],  
			[p2[0], p2[1], 1],
			[p3[0], p3[1], 1]
	); 
	
	let b = det3(
			[p1[0], p1[1], squaredNorm(p1)],  
			[p2[0], p2[1], squaredNorm(p2)],
			[p3[0], p3[1], squaredNorm(p3)]
	);
	
	return [Sx/a, Sy/a];
}


/** 
 * @description Returns the incenter of 3 points (seen as a triangle).
 * @see Wikipedia - https://en.wikipedia.org/wiki/Incenter 
 */
Vector.inCenter = function(triangle) {
	let p1 = triangle[0];
	let p2 = triangle[1];
	let p3 = triangle[2];
	
	var l1 = Vector.distanceBetween(p2, p3);
	var l2 = Vector.distanceBetween(p1, p3);
	var l3 = Vector.distanceBetween(p1, p2);
	var lengthSum = l1 + l2 + l3;
	return [
		(l1*p1[0] + l2*p2[0] + l3*p3[0]) / lengthSum,
		(l1*p1[1] + l2*p2[1] + l3*p3[1]) / lengthSum
	];
}


/**
 * @description .
 */
Vector.centroid = function(polygon) {
	if (polygon.length === 3) {
		let p1 = polygon[0];
		let p2 = polygon[1];
		let p3 = polygon[2];
		
		let x = p1[0] + p2[0] + p3[0]; 
		let y = p1[1] + p2[1] + p3[1];
		
		return [x/3, y/3];
	}
	
	// polygon.length assumed > 3 and assumed to be non-self-intersecting
	// See wikipedia
	
	// First calculate the area, A, of the polygon
	let A = 0;
	for (let i=0; i<polygon.length; i++) {
		let p0 = polygon[i];
		let p1 = (i === polygon.length-1) 
			? polygon[0]
			: polygon[i+1];
			
		A = A + (p0[0]*p1[1] - p1[0]*p0[1]);
	}
	A = A/2;
	
	let C = [0,0];
	for (let i=0; i<polygon.length; i++) {
		let p0 = polygon[i];
		let p1 = (i === polygon.length-1) 
			? polygon[0]
			: polygon[i+1];
			
		C[0] = C[0] + (p0[0] + p1[0]) * (p0[0]*p1[1] - p1[0]*p0[1]); 
		C[1] = C[1] + (p0[1] + p1[1]) * (p0[0]*p1[1] - p1[0]*p0[1]);
	}
	
	return [C[0] / (6*A), C[1] / (6*A)];
}


/**
 * Calculate the determinant of 3 3-vectors, i.e. 3x3 matrix
 * 
 * @param x
 * @param y
 * @param z
 * @returns {number}
 */
function det3(x,y,z) {
	return (x[0]*(y[1]*z[2] - y[2]*z[1])) - 
	       (x[1]*(y[0]*z[2] - y[2]*z[0])) + 
	       (x[2]*(y[0]*z[1] - y[1]*z[0])); 
}


function squaredNorm(x) {
	return x[0]*x[0] + x[1]*x[1];
}


Vector.translate = function(p, t) {
	return [p[0]+t[0], p[1]+t[1]];
}


Vector.equal = function(p1, p2) {
	return (p1[0] === p2[0] && p1[1] === p2[1]);
}


Vector.rotate = function(p, sinAngle, cosAngle) {
	return [
		p[0]*cosAngle - p[1]*sinAngle, 
		p[0]*sinAngle + p[1]*cosAngle
	];
}


Vector.reverseRotate = function(p, sinAngle, cosAngle) {
	return [
		+p[0]*cosAngle + p[1]*sinAngle, 
		-p[0]*sinAngle + p[1]*cosAngle
	];
}


Vector.rotateBy90Degrees = function(p) {
	return [-p[1], p[0]];
}


Vector.rotateByNeg90Degrees = function(p) {
	return [p[1], -p[0]];
}


Vector.transform = function(p, f) {
	return [f(p[0]), f(p[1])];
}



/**
 * @param point        The point
 * @param points       The points 
 * @param distanceFunc Distance function - if null, uses Vector.squaredDistanceBetween
 */
Vector.getClosestTo = function(point, points, distanceFunc) {
	let f = distanceFunc || Vector.squaredDistanceBetween; 

	//if (points.length === 0) { console.log(point)}
	let cp  = undefined;
	let bestd = Number.POSITIVE_INFINITY; 
	for (let i=0; i<points.length; i++) {
		let p = points[i];
		
		let d = f(point, p); 
		if (d < bestd) {
			cp = p;
			bestd = d; 
		} 
	}
	
	return cp;
}


Vector.translatePoints = function(ps, v) {
	// SLOW!
	/*return ps.map(function(p) {
		//return Vector.translate(p, v);
		return [p[0]+v[0], p[1]+v[1]]; 
	});*/
	
	// FAST! (at least on V8, BUT WHY?!)
	let result = [];
	for (let i=0; i<ps.length; i++) {
		result.push([ps[i][0]+v[0], ps[i][1]+v[1]]);
	}
	
	return result;
}


Vector.rotatePoints = function(ps, sinAngle, cosAngle) {
	return ps.map(function(p) {
		return Vector.rotate(p, sinAngle, cosAngle);
	});
}


/** Applies a translation and then rotation to to each point.
 * @returns transformed points 
 **/
Vector.translateThenRotatePoints = function(ps, trans, sinAngle, cosAngle) {
	return ps.map(function(p) {
		return Vector.rotate(Vector.translate(p, trans), sinAngle, cosAngle);
	});
}


/** Applies a rotation and then translation to each point.
 * @returns transformed points 
 **/
Vector.rotateThenTranslatePoints = function(ps, trans, sinAngle, cosAngle) {
	return ps.map(function(p) {
		return Vector.translate(Vector.rotate(p, sinAngle, cosAngle), trans);
	});
}


module.exports = Vector;

},{}]},{},[17]);
