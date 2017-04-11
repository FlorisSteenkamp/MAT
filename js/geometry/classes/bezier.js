'use strict'

let Util            = require('../../utils.js');
let Poly            = require('../../polynomial/polynomial.js');
let gaussQuadrature = require('../../numerical/functions/gaussian-quadrature.js');
let Vector          = require('../../vector/vector.js');


/**
 * The Bezier class represents a bezier, possibly in the context of a 
 * shape.
 * 
 * @param bezierPoints
 * @param indx
 * @returns
 */
function Bezier(bezierPoints, indx) {
	
	this.indx = indx;
	
	//---- Bernstein basis representation
	let [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = bezierPoints; 
	

	//---- Power basis representation
	let x = [
	    x3 - 3*x2 + 3*x1 - x0, // t^3
	    3*x2 - 6*x1 + 3*x0,    // t^2
	    3*x1 - 3*x0,           // t^1
	    x0,                    // t^0
	];
	let y = [
	    y3 - 3*y2 + 3*y1 - y0, // t^3
	    3*y2 - 6*y1 + 3*y0,    // t^2
	    3*y1 - 3*y0,           // t^1
	    y0,                    // t^0
	];
	
	let evaluateX = Poly.evaluate(x);   // Function of t
	let evaluateY = Poly.evaluate(y);   // Function of t
	
	let dx  = Poly.differentiate(x);   // Polynomial in t
	let dy  = Poly.differentiate(y);   // Polynomial in t
	
	let evaluateDx   = Poly.evaluate(dx);      // Function of t
	let evaluateDy   = Poly.evaluate(dy);      // Function of t
	
	let ddx = Poly.differentiate(dx); // Polynomial in t
	let ddy = Poly.differentiate(dy); // Polynomial in t
	
	let evaluateDdx  = Poly.evaluate(ddx);     // Function of t
	let evaluateDdy  = Poly.evaluate(ddy);     // Function of t

	
	let straightLength = Math.sqrt((x3-x0)*(x3-x0) + (y3-y0)*(y3-y0));
	let sinAngle = (y3-y0) / straightLength; 
	let cosAngle = (x3-x0) / straightLength;
	
	
	/**
	 * Returns the differential of length at t.
	 */
	function ds(t) {
		let dx_ = evaluateDx(t);
		let dy_ = evaluateDy(t);
		
		return Math.sqrt(dx_*dx_ + dy_*dy_); 
	}
	
	
	let curveLength = undefined;
	function getCurveLength() {
		if (curveLength) { return curveLength; }
		
		// Numerically integrate the curve length
		let result = gaussQuadrature(ds, [0,1]);
		curveLength = result;
		
		return result;
	}
	
	
	function κ(t) {
		let dx_ = evaluateDx(t); 
		let dy_ = evaluateDy(t);
		let ddx_ = evaluateDdx(t);
		let ddy_ = evaluateDdy(t);
		let denom = dx_*dx_ + dy_*dy_; 
		
		return (dx_*ddy_ - dy_*ddx_) / Math.sqrt(denom*denom*denom);
	}
	

	function κTimesSDiff(t) {
		let dx_ = evaluateDx(t); 
		let dy_ = evaluateDy(t);
		let ddx_ = evaluateDdx(t);
		let ddy_ = evaluateDdy(t);
		let denom = dx_*dx_ + dy_*dy_;
		
		return (dx_*ddy_ - dy_*ddx_) / denom;
	}
	
	
	let totalAbsoluteCurvature = {};
	function getTotalAbsoluteCurvature(interval_) {
		let interval = interval_ || [0,1];
		let key = '' + interval[0] + ', ' + interval[1]; 
		if (totalAbsoluteCurvature[key]) { 
			return totalAbsoluteCurvature[key]; 
		}
		
		// Numerically integrate the absolute curvature
		let result = gaussQuadrature(
				t => Math.abs(κTimesSDiff(t)),
				interval
		);
		totalAbsoluteCurvature[key] = result;
		
		return result;
	}
	
	
	let totalCurvature = undefined;
	function getTotalCurvature() {
		if (totalCurvature) { return totalCurvature; }
		
		// Numerically integrate the curvature.
		let result = gaussQuadrature(
				κTimesSDiff,
				[0,1]
		);
		totalCurvature = result;
		
		return result;
	}
	
	
	// Math is from http://math.info/Calculus/Curvature_Parametric/
	// See the maxima file for details
	/** 
	 * A modified version of differential of κ (use quotient rule,
	 * ignore denominator and multiply by 2/3). We need to find the 
	 * zeros of this function to get the min/max curvature.
	**/
	function dκ(t) {
		var ts = t*t;
		var omt = 1-t; 
		
		var a = ts*x3;
		var i = ts*y3;
		var b = 2*t - 3*ts;
		var c = (3*t-1)*omt;
		var d = omt*omt;
		var e = 3 * (a+b*x2-c*x1-d*x0);
		var f = 3 * (i+b*y2-c*y1-d*y0);
		var g = 6 * (t*y3-(3*t-1)*y2 + (3*t-2)*y1 + omt*y0); 
		var h = 6 * (t*x3-(3*t-1)*x2 + (3*t-2)*x1 + omt*x0);

		return 4*(e*(y3-3*y2+3*y1-y0) - 
			  f*(x3-3*x2+3*x1-x0)) * Math.pow((f*f+e*e), (3/2)) - 
			  (e*g-h*f)*(2*g*f+2*h*e) * Math.sqrt(f*f+e*e); 
	}

	
	/** Evaluate the bezier parametric equation at some value 
	 * @param t {Number [0,1]} The point where the evaluation should take place 
	 * 
	 * @returns { [Number, Number] }
	 **/
	function evaluate(t) {
		if (t === 0) {
			return [x0, y0];
		} else if (t === 1) {
			return [x3, y3];
		}
		
		return [
			evaluateX(t),
			evaluateY(t)
		];
	}
	
	
	function tangent(t) {
		let dx_ = evaluateDx(t);
		let dy_ = evaluateDy(t);
		let d = Math.sqrt(dx_*dx_ + dy_*dy_);

		return [dx_/d, dy_/d];
	}
	
	
	function normal(t) {
		let tangent_ = tangent(t);
		return [tangent_[1], -tangent_[0]];
	}

	
	var boundingBoxTight = null;  // Cache (Memoization)
	function getBoundingBoxTight() { 
		if (boundingBoxTight) { return boundingBoxTight; }		
		
		var box = getNormalizedBoundingBox();
		
		var p0x = box[0][0];
		var p0y = box[0][1];
		var p1x = box[1][0];
		var p1y = box[1][1];

		var axisAlignedBox = [ 
			box[0], [p1x, p0y],
			box[1], [p0x, p1y]
		];

		boundingBoxTight = Vector.rotateThenTranslatePoints(
				axisAlignedBox, 
				bezierPoints[0], 
				sinAngle, 
				cosAngle
		); 
		
		return boundingBoxTight;
	}
	

	let normalizedBoundingBox = null;
	/** Get normalized bounding box - memoized */
	function getNormalizedBoundingBox() {
		if (normalizedBoundingBox) { return normalizedBoundingBox; }
		
		// Cache
		let vectorToOrigin = Vector.transform(bezierPoints[0], x => -x);
		let normalizedBezier = new Bezier(
			Vector.translateThenRotatePoints(
					bezierPoints, 
					vectorToOrigin, 
					-sinAngle, 
					cosAngle
			),
			undefined
		);
		
		normalizedBoundingBox = normalizedBezier.getBoundingBox(); 
		
		return normalizedBoundingBox;
	}
	
	
	let boundingBox = undefined;
	this.tAtMaxX = undefined;
	function getBoundingBox() {
		if (boundingBox) { return boundingBox; }
		
		// The a,b and c in the quadratic equation of the derivative of 
		// x(t) and y(t) set equal to 0.

		let ds = [dx, dy];
		
		let roots = ds.map(Poly.findQuadraticRoots01); 
		
		// Endpoints
		roots[0].push(0); roots[0].push(1);
		roots[1].push(0); roots[1].push(1);
		
		// Test points
		let testPointsX = roots[0].map(evaluateX);
		let testPointsY = roots[1].map(evaluateY);

		
		let minX = Number.POSITIVE_INFINITY;
		let maxX = Number.NEGATIVE_INFINITY;
		for (let i=0; i<roots[0].length; i++) {
			let xx = evaluateX(roots[0][i]);  
			if (xx > maxX) {
				maxX = xx;
				this.tAtMaxX = roots[0][i];
			}
			if (xx < minX) {
				minX = xx;
			}
		}
		
		
		boundingBox = ([
			[minX, Util.min(testPointsY)],
			[maxX, Util.max(testPointsY)]
		]);
		
		return boundingBox;
	}
	
	
	// Public members
	this.bezierPoints = bezierPoints;

	this.tangent = tangent;
	this.normal  = normal;
	
	this.getBoundingBox = getBoundingBox;
	this.getBoundingBoxTight = getBoundingBoxTight;
	this.getTotalAbsoluteCurvature = getTotalAbsoluteCurvature;
	this.getTotalCurvature = getTotalCurvature;
	this.getCurveLength = getCurveLength;
	this.κ = κ;
	this.dκ = dκ;
	
	this.evaluate = evaluate;
}
		

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







