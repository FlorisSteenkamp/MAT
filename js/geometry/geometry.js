'use strict'

let Util          = require('../utils.js');
let Poly          = require('../polynomial/polynomial.js');
let Circle        = require('./classes/circle.js');
let Arc           = require('./classes/arc.js');
let PointOnShape  = require('./classes/point-on-shape.js');
let Bezier        = require('./classes/bezier.js');
let allRootsVAS   = require('../polynomial/functions/all-roots-vas.js');
let Vector        = require('../vector/vector.js');

let Geometry = {};


/** 
 * @return {Boolean} true if first circle engulfs the second.
 */
Geometry.doesCircleEngulfCircle = function(c1, c2) {
	if (c1.radius <= c2.radius) { 
		return false; 
	}
	
	let d = Vector.squaredDistanceBetween(c1.center, c2.center);
	let dr = c1.radius - c2.radius; 
	let δ = dr*dr;

	return δ > d;
}


/**
 * From http://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
 * This function is currently unused. 
 */
Geometry.doesLineIntersectCircle = function(circle, p0, p1) {
	var x0 = p0[0];
	var y0 = p0[1];
	var x1 = p1[0];
	var y1 = p1[1];
	var radius = circle.radius;
	var cx = circle.center[0];
	var cy = circle.center[1];
	
	var dx = x1 - x0;
	var dy = y1 - y0;
	var fx = x0 - cx;
	var fy = y0 - cy;
	
	var a = dx*dx + dy*dy; 
	var b = 2*(fx*dx + fy*dy)  
	var c = fx*fx + fy*fy - radius*radius; 

	var discriminant = b*b-4*a*c;
	if (discriminant < 0) {
		// no intersection
		return false;
	} else {
	  // ray didn't totally miss sphere,
	  // so there is a solution to
	  // the equation.

	  discriminant = Math.sqrt( discriminant );

	  // either solution may be on or off the ray so need to test both
	  // t1 is always the smaller value, because BOTH discriminant and
	  // a are nonnegative.
	  var t1 = (-b - discriminant)/(2*a);
	  var t2 = (-b + discriminant)/(2*a);

	  // 3x HIT cases:
	  //          -o->             --|-->  |            |  --|->
	  // Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit), 

	  // 3x MISS cases:
	  //       ->  o                     o ->              | -> |
	  // FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)

	  if( t1 >= 0 && t1 <= 1 ) {
	    // t1 is the intersection, and it's closer than t2
	    // (since t1 uses -b - discriminant)
	    // Impale, Poke
	    return true;
	  }

	  // here t1 didn't intersect so we are either started
	  // inside the sphere or completely past it
	  if( t2 >= 0 && t2 <= 1 )  {
	    // ExitWound
	    return true;
	  }

	  // no intn: FallShort, Past, CompletelyInside
	  return false;
	}
}


/**
 * 
 * @param shape
 * @param δ
 * @returns
 */
Geometry.getBoundaryPieceBeziers = function(shape, δ) {
	
	let goStraight = true; // As opposed to go first around circle and take last exit
	
	var cp0 = δ[0]; 
	var cp1 = δ[1];
	
	var bezierPieces = [];
	
	var pos_start = cp0.item.pointOnShape;
	var bezierPiece = new BezierPiece(pos_start.bezierNode, [pos_start.t, pos_start.t]);
	
	var ii = 0; // Safeguard
	do {
		if (goStraight) {
			// This is either a) a 1-prong or ...
			// ... b) a contact point who's matCircle has not yet been resolved
			// TODO change this so that there is no b) anymore

			goStraight = false;
			
			var pThis = cp0     .item.pointOnShape;
			var pNext = cp0.next.item.pointOnShape;
			
			if (pNext.bezierNode === pThis.bezierNode) {
				bezierPiece.tRange[1] = pNext.t;
				bezierPieces.push(bezierPiece);
			} else {
				bezierPiece.tRange[1] = 1;
				bezierPieces.push(bezierPiece);
				
				addSkippedBeziers(bezierPieces, pThis, pNext);
			}
			
			cp0 = cp0.next;
		} else {
			goStraight = true;
			
			cp0 = cp0.prevOnCircle; // Actually, next, next, ..., i.e. take last exit
			
			var newPos = cp0.item.pointOnShape; 
			bezierPiece = new BezierPiece(newPos.bezierNode, [newPos.t, newPos.t]);
		}
		
		
		ii++;
	} while (cp0 !== cp1);
	
	
	bezierPieces.push(bezierPiece);
	
	return bezierPieces;
	
	
	/**
	 * Adds pieces of skipped beziers
	 */
	function addSkippedBeziers(bezierPieces, pThis, pNext) {

		var bNode = pThis.bezierNode;
		while (bNode !== pNext.bezierNode) {
			
			bNode = bNode.next;
			
			if (bNode !== pNext.bezierNode) {
				bezierPieces.push( new BezierPiece(bNode, [0, 1]) );
			} else {
				bezierPieces.push( new BezierPiece(bNode, [0, pNext.t]) );
			}
		}
	}
	
}


function BezierPiece(bezierNode, tRange) {
	this.bezierNode = bezierNode;
	this.tRange = tRange;
}


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
	
	var points = [];
	var bezierPieces = Geometry.getBoundaryPieceBeziers(shape, δ, false);
	
	for (var i=0; i<bezierPieces.length; i++) {
		bezierPiece = bezierPieces[i];
		
		var bezier = bezierPiece.bezierNode.item;
		var iPoints = Geometry.getLineBezierIntersectionPoints(
				line, 
				bezier, 
				bezierPiece.tRange
		);
		
		for (var j=0; j<iPoints.length; j++) {
			points.push(iPoints[j].p);
		}
	}
	
	return points;
}


function getTRanges(ps, bezier, tRange=[0,1]) {
	
	let tRanges = [];
	
	let isP0OnBezier = ps[0].bezierNode.item === bezier; 
	let isP1OnBezier = ps[1].bezierNode.item === bezier;

	if (!isP0OnBezier && !isP1OnBezier) {
		return [tRange];
	}
	
	//---- Cache
	// At this point either or both of isP0OnBezier and isP1OnBezier is true
	let crossT1 = isP0OnBezier && !isP1OnBezier;
	let crossT0 = isP1OnBezier && !isP0OnBezier;
	
	let a = isP0OnBezier ? ps[0].t : 0; 
	let b = isP1OnBezier ? ps[1].t : 1;
	let c = tRange[0];
	let d = tRange[1];
	 
	 		
	if (b <= c) {
		//  |---a---b-------c---d---|
		//  |---------------a------b|
		//  |----------------------c|
		//  |----------------------d|

		if (c === d && crossT1) {
			return [];
		} else {
			return [tRange];
		}
	} else if (a <= c && b >= d) {
		//  |---a---c-------d---b---|
		return [];
	} else if (c <= a && d >= b) { 
		//  |---c---a-------b---d---|
		let res = [];
		if (c !== a) { 
			res.push([c,a]);
		}
		if (b !== d) {
			res.push([b,d]);
		}
		return res;
	} else if (a <= c && b <= d) {
		//  |---a---c-------b---d---|
		return [[b,d]];
	} else if (c <= a && d <= b) {
		//  |---c---a-------d---b---|
		return [[c,a]];
	}
}


Geometry.closestSquaredDistanceToRotatedRect = function(bezier, p) {
	let tightBoundingBox = bezier.getBoundingBoxTight();
	
	let ds = [0,1,2,3].map(function(i) {
		return Vector.squaredDistanceBetweenPointAndLineSegment(
				p, 
				[tightBoundingBox[i], tightBoundingBox[(i+1) % 4]]
		);				
	});
	
	return Util.bestBy(ds);
}


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


Geometry.getShapeRightMostInfo = function(bezierArr, _debug_) {
	
	let maxX = Number.NEGATIVE_INFINITY;
	let maxBezier = undefined;
	for (let i=0; i<bezierArr.length; i++) {
		let bezier = bezierArr[i];

		let rightMost = bezier.getBoundingBox()[1][0];
		if (rightMost > maxX) {
			maxX = rightMost;
			maxBezier = bezier;
		}
	}

	return { maxX, maxBezier };
}


/**
 * Checks if a shape is positively orientated or not. 
 */
Geometry.isShapePositivelyOrientated = function(bezierArr, _debug_) {
	// TODO - must still handle the case where the rightmost point
	// is sharp.
	
	//console.log(bezierArr)
	
	let { maxX, maxBezier } = 
		Geometry.getShapeRightMostInfo(bezierArr, _debug_);
	
	//console.log(maxX, maxBezier.tAtMaxX);
	
	let tan = maxBezier.tangent(maxBezier.tAtMaxX);
	
	//console.log(tan);
	
	return tan[1] > 0;
}



let prevBezier = undefined; // Cache
let prevP = undefined;
let prevT = undefined; 
let memClosestPoint  = undefined; // ...
let prevTRange = undefined;
let prevTouchedBezier = undefined;
let iii = 0;
Geometry.closestPointBetween_PointAndBezier = function(
		bezierNode, p, tRange, touchedBezierNode, t, _debug_, slog) {
	
	
	let bezier = bezierNode.item;
	let touchedBezier = touchedBezierNode ? touchedBezierNode.item : undefined;
	
	if (prevBezier === bezier && prevP === p && prevT === t && 
			tRange[0] === prevTRange[0] && tRange[1] === prevTRange[1] && 
			prevTouchedBezier === touchedBezier) {
		return memClosestPoint;
	}
	prevBezier = bezier;
	prevP = p;
	prevT = t;
	prevTRange = tRange;
	prevTouchedBezier = touchedBezier;

	
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
		//console.log('def-poly(t): ' + Poly.evaluate(deflatedPoly)(t));
		//console.log('    poly(t): ' + Poly.evaluate(poly)(t));
		//console.log('pol', t, Poly.allRoots01(poly));
		//console.log('def', t, Poly.allRoots01(deflatedPoly));
		poly = deflatedPoly;
	}
	

	//let allRoots = allRootsVAS(poly, tRange, _debug_);
	let allRoots = Poly.allRoots01(poly);
	let roots = allRoots.filter(function(root) {
		return root >= tRange[0] && root <= tRange[1];
	});
	
	
	if (slog) { 
		//console.log('a') 
	}
	
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

	/*
	roots.push(tRange[0]);
	roots.push(tRange[1]);
	*/
	
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
		return { p: bezier.evaluate(root), t: root };
	});
	let closestPoint = Vector.getClosestTo(p, ps, function(p1, p2) {
		return Vector.squaredDistanceBetween(p1, p2.p);
	});
	

	memClosestPoint = closestPoint; 
	return closestPoint;
}


Geometry.degAngleFromSinCos = function(sinAngle, cosAngle) {

	var toRad = function(a) {
		return a * (Math.PI/180);
	} 
	var toDeg = function(a) {
		return a * (180/Math.PI);
	}
	
	if (cosAngle === 0) {
		if (sinAngle > 0) { return 90; }
		return 270;
	}
	if (cosAngle > 0) {
		return toDeg(Math.atan(sinAngle / cosAngle));
	}
	return 180 + toDeg(Math.atan(sinAngle / cosAngle));
}


/** 
 * Returns the closest point on the arc.
 * 
 * @returns { p, position } where position is either 0, 1 or 2 
 *          indicating if the closest point is at either endpoint 
 *          (1 or 2) or interior to the arc (0). 
 * 
 * Note: Needs to be quite fast 
 */
Geometry.closestPointOnArc = function(p, arc) {
	// arc ->def  [circle, startpoint, endpoint, sin_angle1, cos_angle1, sin_angle2, cos_angle2]
	
	if (arc.circle !== null) { // else the arc is degenerate into a line
		// First move arc circle onto origin
		var x = arc.circle.center[0];
		var y = arc.circle.center[1];
		
		var arco = new Arc(
			new Circle([0,0], arc.circle.radius), 
			Vector.translate(arc.startpoint,[-x,-y]), 
			Vector.translate(arc.endpoint,[-x,-y]),
			arc.sin_angle1, 
			arc.cos_angle1, 
			arc.sin_angle2, 
			arc.cos_angle2
		);
		
		var pp = Vector.translate(p, [-x,-y]);
		var l = Vector.length(pp);
		var sin_pp = -pp[1] / l; 			
		var cos_pp = pp[0] / l;
		
		if (Geometry.isAngleBetween(sin_pp, cos_pp, arco.sin_angle1, arco.cos_angle1, arco.sin_angle2, arco.cos_angle2)) {
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


/** 
 * @return A directional arc from 3 ordered points. 
 */
Geometry.arcFrom3Points = function(circlePoints) {
	var midPoint1 = Vector.mean([circlePoints[0], circlePoints[1]]);   
	var midPoint2 = Vector.mean([circlePoints[1], circlePoints[2]]);
	
	var chord1 = Vector.fromTo(circlePoints[0], circlePoints[1]); 
	var chord2 = Vector.fromTo(circlePoints[1], circlePoints[2]);
	
	var perpendicular1 = [chord1[1], -chord1[0]];   
	var perpendicular2 = [chord2[1], -chord2[0]];
	
	var line1 = [midPoint1, Vector.translate(perpendicular1, midPoint1)];
	var line2 = [midPoint2, Vector.translate(perpendicular2, midPoint2)];
	
	var circleCenter = Geometry.lineLineIntersection(line1, line2);

	var arc;
	if (circleCenter === null) { // If the circle is in effect a line segment
		if (Vector.equal(circlePoints[0], circlePoints[2])) {
			return null;
		}
		arc = new Arc(null, circlePoints[0], circlePoints[2]);
		return arc;
	} 
	
	var sideVector1 = Vector.fromTo(circleCenter, circlePoints[0]);
	var midVector   = Vector.fromTo(circleCenter, circlePoints[1]);
	var sideVector2 = Vector.fromTo(circleCenter, circlePoints[2]);
	var radius = Vector.length(sideVector1);
	var sin_angle1   = -sideVector1[1] / radius; 
	var cos_angle1   =  sideVector1[0] / radius;
	var sin_angle2   = -sideVector2[1] / radius; 
	var cos_angle2   =  sideVector2[0] / radius;
	var sin_midangle = -midVector  [1] / radius; 
	var cos_midangle =  midVector  [0] / radius;
	
	if (Geometry.isAngleBetween(sin_midangle, cos_midangle, sin_angle1, cos_angle1, sin_angle2, cos_angle2)) {
		arc = new Arc(
			new Circle(circleCenter, radius), 
			circlePoints[0], circlePoints[2], 
			sin_angle1, cos_angle1, sin_angle2, cos_angle2
		);
	} else {
		arc = new Arc(
			new Circle(circleCenter, radius), 
			circlePoints[2], circlePoints[0], 
			sin_angle2, cos_angle2, sin_angle1, cos_angle1
		);				
	}
	
	return arc;
}


Geometry.quadrant = function(sin_angle, cos_angle) {
	if (sin_angle >= 0) { 
		if (cos_angle >= 0) { return 1; } 
		return 2;
	}
	if (cos_angle >= 0) { return 4; }
	return 3;
}


Geometry.isAngle1LargerOrEqual = function(sin_angle1, cos_angle1, sin_angle2, cos_angle2) {
	var q1 = Geometry.quadrant(sin_angle1, cos_angle1); 
	var q2 = Geometry.quadrant(sin_angle2, cos_angle2);
	
	if (q1 > q2) { return true; }
	if (q1 < q2) { return false; }
	
	// Same quadrant
	if (q1 === 1 || q1 === 4) { 
		return sin_angle1 >= sin_angle2;
	}
	return sin_angle1 <= sin_angle2;
}


/** 
 * Returns true if angle1 < angle < angle2 in the non-trivial sense.
 */ 
Geometry.isAngleBetween = function(sin_angle, cos_angle, sin_angle1, cos_angle1, sin_angle2, cos_angle2) {
	var t1_larger_t2 = Geometry.isAngle1LargerOrEqual(sin_angle1, cos_angle1, sin_angle2, cos_angle2);
	var a_larger_t2  = Geometry.isAngle1LargerOrEqual(sin_angle, cos_angle, sin_angle2, cos_angle2);
	var a_larger_t1  = Geometry.isAngle1LargerOrEqual(sin_angle, cos_angle, sin_angle1, cos_angle1);
	
	var res;
	if (t1_larger_t2) {
		res = (a_larger_t1 || (!a_larger_t2));
	} else { 
		res = (a_larger_t1 && (!a_larger_t2));
	}
	
	return res;
}


/**
 * Find point where two lines intersect.
 *  
 * @param line1 The first line - given as 2 points 
 * @param line2 The first line - given as 2 points
 * @returns Point where two lines intersect or null if they don't or intersect everywhere. 
 */ 
Geometry.lineLineIntersection = function(line1, line2) {
	var p1x = line1[0][0];
	var p1y = line1[0][1];
	var p2x = line1[1][0];
	var p2y = line1[1][1];
	var p3x = line2[0][0];
	var p3y = line2[0][1];
	var p4x = line2[1][0];
	var p4y = line2[1][1];
	var v1x = p2x - p1x;
	var v1y = p2y - p1y;
	var v2x = p4x - p3x;
	var v2y = p4y - p3y;
	
	var cross = v2x*v1y - v2y*v1x;
	if (cross === 0) {
		//console.log('parallel')
		return undefined;
	} 
	
	let b = ((p3y-p1y)*v1x - (p3x-p1x)*v1y) / (cross);	
	
	return [p3x + b*v2x, p3y + b*v2y];
}


Geometry.lineThroughPointAtRightAngleTo = function(p, v) {
	let vv = [-v[1], v[0]];
	let p20 = p[0] + vv[0];
	let p21 = p[1] + vv[1];
	
	return [p, [p20,p21]];
}


/**
 * Get all intersection points between a line and a bezier within a certain t range.
 * 
 * @returns An array of { p, t } 
 */
Geometry.getLineBezierIntersectionPoints = function(line, bezier, tRange) {
	var t = [-line[0][0], -line[0][1]];
	var p = [
	    line[1][0] + t[0],
	    line[1][1] + t[1],
	];
	
	
	//---- Cache
	var lineLength = Vector.length(p); 
	var sinAngle = -p[1] / lineLength;
	var cosAngle = p[0] / lineLength;
	

	var bezierPoints = Vector.translateThenRotatePoints(
			bezier.bezierPoints, t, sinAngle, cosAngle
	);
	
	var x0 = bezierPoints[0][0]; 
	var y0 = bezierPoints[0][1];
	var x1 = bezierPoints[1][0]; 
	var y1 = bezierPoints[1][1];
	var x2 = bezierPoints[2][0]; 
	var y2 = bezierPoints[2][1];
	var x3 = bezierPoints[3][0]; 
	var y3 = bezierPoints[3][1];
	
	var x = [
	    x3 - 3*x2 + 3*x1 - x0, // t^3
	    3*x2 - 6*x1 + 3*x0,    // t^2
	    3*x1 - 3*x0,           // t^1
	    x0,                    // t^0
	];
	var y = [
	    y3 - 3*y2 + 3*y1 - y0, // t^3
	    3*y2 - 6*y1 + 3*y0,    // t^2
	    3*y1 - 3*y0,           // t^1
	    y0,                    // t^0
	];
	
	
	var roots = Poly.findCubicRoots01(y);
	
	var res = roots
	/*.filter(function(t) {
		return ((t >= tRange[0]) && (t <= tRange[1]));
	})*/
	.map(function(t) {
		return { p: bezier.evaluate(t), t: t };
	});
	
	return res;
}


/**
 * Given a circle, bound it tightly by an axes-aligned box (i.e. circle box). 
 * And given a bezier, bound tightly by a rectangle (not necessarily axes aligned) (i.e. bezier box).
 *  
 *  @return True if bezier box is entirely outside circle box
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
			bezier.getBoundingBoxTight(), 
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
 * Checks if circle intersects the shape. 
 * 
 * @param shape
 * @param circle
 * @param exclPoint {PointOnShape} Exclude this point and a small t gap around it.
 * 
 * NOTE: Circle can only intercept shape an even number of times (counting duplicate roots).
 */
// TODO - change tGap to a gap in pixels if possible
Geometry.doesCircleIntersectShape = function(shape, circle, exclPoint) {
	
	// A t gap within the shape that should not be checked.
	// TODO - rather remove point from quintic as a poly factor (watch out for double roots).
	const tGap = 0.02;
  
	
	//---- Trivial case: osculating point, i.e. sharp corner
	if (circle.radius === 0) { return false; } 

	//---- Readability cache
	var radius = circle.radius;
	var ox = circle.center[0];
	var oy = circle.center[1];

	//---- Initialization
	var candidateBeziers = [];
	var pointsCounts = {};
	var node = shape.beziers.head;

	let ps = PointOnShape.split(exclPoint, tGap);
	
	do {
		var bezier = node.item;
		
		//---- If bezier [tight box] is wholly contained in osculating circle then:
		// bezier is wholly contained in circle => some part of circle is outside shape boundary
		if (!isBezierBoxWhollyOutsideCircleBox(bezier, circle)) {
			candidateBeziers.push(bezier);
		}
		
		node = node.next;
	} while (node !== shape.beziers.head);

	
	for (let i=0; i<candidateBeziers.length; i++) {
		
		// We can provide an additional stage in future as an optimization, i.e.
		// Check if circle intersects tighter bounding boxes - it can either:
		// a: not intersect -> either: 
		//    i:  bezier is contained in circle - return true immediately
		//    ii: else bezier is eliminated
		// b: intersect in 1 point (unlikely) -> bezier is eliminated
		// c: intersect in 3 points -> return true immediately
		// d: intersect in 2 points -> either:
		//    i: parallel sides -> return true immediately
		//    ii: non-parallel sides -> further check is required (as below)
		
	
		//---- Test if circle literally intersects bezier
		
		//---- First translate circle and bezier together so circle is centered on origin
		let candidateBezier = candidateBeziers[i];
		let bezierPoints = Vector.translatePoints(
			candidateBezier.bezierPoints, 
			[-ox, -oy]
		); 
		
		//---- Cache
		let x0 = bezierPoints[0][0]; 
		let y0 = bezierPoints[0][1];
		let x1 = bezierPoints[1][0]; 
		let y1 = bezierPoints[1][1];
		let x2 = bezierPoints[2][0]; 
		let y2 = bezierPoints[2][1];
		let x3 = bezierPoints[3][0]; 
		let y3 = bezierPoints[3][1];
		
		
		//** To get the intersection points we need to solve: 
		//   (see http://math.stackexchange.com/questions/436216/intersection-of-cubic-bezier-curve-and-circle)
		//         Bx(t)^2 + By(t)^2 - r^2 = 0   (t = [0..1])
		//      => a6*t^6 + a5*t^5 +  a4*t^4 + a3*t^3 + a2*t^2 + a1*t + a0 = 0
		let x0_2 = x0*x0; let x1_2 = x1*x1; 
		let x2_2 = x2*x2; let x3_2 = x3*x3;
		let y0_2 = y0*y0; let y1_2 = y1*y1; 
		let y2_2 = y2*y2; let y3_2 = y3*y3;
			
		let t6 = y3_2 - 6*y2*y3 + 6*y1*y3 - 2*y0*y3 + 9*y2_2 - 
				 18*y1*y2 + 6*y0*y2 + 9*y1_2 - 6*y0*y1 + y0_2 + 
				 x3_2 - 6*x2*x3 + 6*x1*x3 - 2*x0*x3 + 9*x2_2 - 
				 18*x1*x2 + 6*x0*x2 + 9*x1_2 - 6*x0*x1 + x0_2;
		let t5 = 6*y2*y3 - 12*y1*y3 + 6*y0*y3 - 18*y2_2 + 54*y1*y2 - 
				 24*y0*y2 - 36*y1_2 + 30*y0*y1 - 6*y0_2 + 
		         6*x2*x3 - 12*x1*x3 + 6*x0*x3 - 18*x2_2 + 54*x1*x2 - 
		         24*x0*x2 - 36*x1_2 + 30*x0*x1 - 6*x0_2; 
		let t4 = 6*y1*y3 - 6*y0*y3 + 9*y2_2 - 54*y1*y2 + 36*y0*y2 + 
				 54*y1_2 - 60*y0*y1 + 15*y0_2 + 
		         6*x1*x3 - 6*x0*x3 + 9*x2_2 - 54*x1*x2 + 36*x0*x2 + 
		         54*x1_2 - 60*x0*x1 + 15*x0_2;
		let t3 = 2*y0*y3 + 18*y1*y2 - 24*y0*y2 - 
				 36*y1_2 + 60*y0*y1 - 20*y0_2 + 
		         2*x0*x3 + 18*x1*x2 - 24*x0*x2 - 
		         36*x1_2 + 60*x0*x1 - 20*x0_2;				
		let t2 = 6*y0*y2 + 9*y1_2 - 30*y0*y1 + 15*y0_2 + 
		         6*x0*x2 + 9*x1_2 - 30*x0*x1 + 15*x0_2;
		let t1 = 6*y0*y1 - 6*y0_2 + 6*x0*x1 - 6*x0_2;
		let t0 = y0_2 + x0_2 - radius*radius;
			
		let poly = [t6,t5,t4,t3,t2,t1,t0];
		
		let tRanges = getTRanges(ps, candidateBezier, undefined, true, false);
		
		let peval = Poly.evaluate(poly); 
		for (let tRange of tRanges) {
			// First check if left and right endpoints at t=0 and t=1 have different signs - this quick check
			// will eliminate most cases where there is only a single root.
			// In future also check Budan's method again for max number of roots since we rarely expect 3 or more roots
			// this may speed things up.
			
			if (peval(tRange[0]) / peval(tRange[1]) < 0) {
				return true;
			}
			
			// Important Note: Number of sturm tests can drastically be reduced by eliminating
			// most neighbouring beziers by using tight bounding box overlapped with control point convex hull
			// test to see if it intesects with cirlce - should improve algorithm speed
			
			// Note: Another method apart from sturm is possible by doing a cascade of differentiation and
			//       checking where zeros lies at each stage starting from quadratic - at most 9 zeros need to be found
			//       in this case - probably faster than Sturm!

			// TODO - Note: we must really still test endpoints here
			let totalRoots = Poly.rootsWithin(poly, tRange[0], tRange[1]); 
			if (totalRoots > 0) {
				return true; // else check next circle
			}
		}
	}

	return false;
}


module.exports = Geometry;


