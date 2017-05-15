'use strict'

let Util            = require('../../utils.js');
let Poly            = require('../../polynomial/polynomial.js');
let Vector          = require('../../vector/vector.js');
let Memoize         = require('../../memoize.js');

let gaussQuadrature = require('../../numerical/functions/gaussian-quadrature.js');


/**
 * Representation of a 3rd degree (i.e. cubic) bezier, possibly in the 
 * context of a shape.
 * 
 * @param bezierPoints
 * @param indx
 * @returns
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
 * @param t {Number} - The point where the evaluation should take place. 
 * 
 * @returns {Number[]}
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
 * @param {Number[]} interval_
 * @returns The result in radians.
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
 * @param {Number[][]} bezierPoints
 * @param {Number} sinAngle - Sine of angle made by line from first 
 * bezier point to last with x-axis.
 * @param {Number} cosAngle - Cosine of angle made by line from first 
 * bezier point to last with x-axis.
 * @returns {Number[][]} Bounding box in the form
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
 * @returns {Number[][]} The tight bounding box of the bezier as four
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
 * @description Returns general bezier bounds.
 * @returns The axis-aligned bounding box together with the t values
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
 * @returns {Number[][]} the axis-aligned bounding box in the form
 * [[minx, miny], [maxx,maxy]
 */
Bezier.getBoundingBox = Memoize.m1(function(bezier) {
	return Bezier.getBounds(bezier).box;
});


/**
 * @description Find the intersection points of the two beziers.
 * @returns {Number[][]} A list of points.
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
