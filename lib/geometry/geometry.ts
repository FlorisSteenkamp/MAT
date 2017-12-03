
import Poly         from 'flo-poly';
import Vector       from 'flo-vector2d';

import Circle       from './classes/circle';
import Shape        from './classes/shape';
import Arc          from './classes/arc';
import PointOnShape from './classes/point-on-shape';
import Bezier3      from 'flo-bezier3';

import ListNode     from '../linked-list/list-node';
import ContactPoint from '../mat/classes/contact-point';


/**
 * Find point where two lines intersect. Returns he point where the two lines 
 * intersect or null if they don't intersect or are the same line. 
 * @param l1 - The first line 
 * @param l2 - The second line
 */ 
function lineLineIntersection(l1: number[][], l2: number[][]): number[] {

	let [[p1x, p1y], [p2x, p2y]] = l1; 
	let [[p3x, p3y], [p4x, p4y]] = l2;
	
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
 * Get line shape intersection points.
 * 
 * @param line A line described by two points
 * @param δ A boundary piece described by start and end contact points
 *
 * Currently not used
 */
function getLineBoundaryIntersectionPoints(
        line: number[][], δ: ListNode<ContactPoint>[]): number[][] {
	
	let points = [];
	let bezierPieces = Shape.getBoundaryPieceBeziers(δ);
	
	for (let i=0; i<bezierPieces.length; i++) {
		let bezierPiece = bezierPieces[i];
		
		let ps = bezierPiece.bezierNode.item.bezier3;
		let iPoints = getLineBezierIntersectionPoints(
				line, 
				ps, 
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
function closestSquaredDistanceToRotatedRect(ps: number[][], p: number[]) {
	let tightBoundingBox = ps;
	let ds = [0,1,2,3].map(function(i) {
		return Vector.squaredDistanceBetweenPointAndLineSegment(
				p, 
				[tightBoundingBox[i], tightBoundingBox[(i+1) % 4]]
		);				
	});
	
	return Math.min(...ds);
}


/**
 * .
 */
function getClosestSquareDistanceToRect(box: number[][], p: number[]) {

	let [[x0,y0],[x1,y1]] = box;
	let [xp,yp] = p;
	
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
 * Returns the angle (in degrees) given the sine and the cosine of an angle.
 * @private
 */
function degAngleFromSinCos(sinθ: number, cosθ: number) {

	let toDeg = (θ: number) => θ * (180/Math.PI);
	
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
 * Returns a directional arc from 3 ordered points. 
 */
function arcFrom3Points(ps: number[][]) {
	let midPoint1 = Vector.mean([ps[0], ps[1]]);   
	let midPoint2 = Vector.mean([ps[1], ps[2]]);
	
	let chord1 = Vector.fromTo(ps[0], ps[1]); 
	let chord2 = Vector.fromTo(ps[1], ps[2]);
	
	let perpendicular1 = [chord1[1], -chord1[0]];   
	let perpendicular2 = [chord2[1], -chord2[0]];
	
	let l1 = [midPoint1, Vector.translate(perpendicular1, midPoint1)];
	let l2 = [midPoint2, Vector.translate(perpendicular2, midPoint2)];
	
	let circleCenter = lineLineIntersection(l1, l2);

	let arc;
	if (!circleCenter) { 
		// TODO - not right - fix
		/*
		// The circle is in effect a line segment.
		if (Vector.equal(ps[0], ps[2])) {
			return null;
		}
		arc = new Arc(null, ps[0], ps[2]); 
		return arc;
		*/
		return undefined;
	} 
	
	let sideVector1 = Vector.fromTo(circleCenter, ps[0]);
	let midVector   = Vector.fromTo(circleCenter, ps[1]);
	let sideVector2 = Vector.fromTo(circleCenter, ps[2]);
	let radius = Vector.len(sideVector1);
	let sinθ1   = -sideVector1[1] / radius; 
	let cosθ1   =  sideVector1[0] / radius;
	let sinθ2   = -sideVector2[1] / radius; 
	let cosθ2   =  sideVector2[0] / radius;
	let sin_midangle = -midVector  [1] / radius; 
	let cos_midangle =  midVector  [0] / radius;
	
	if (isAngleBetween(sin_midangle, cos_midangle, sinθ1, cosθ1, sinθ2, cosθ2)) {
		arc = new Arc(
			new Circle(circleCenter, radius), 
			sinθ1, cosθ1, sinθ2, cosθ2,
			ps[0], ps[2]
		);
	} else {
		arc = new Arc(
			new Circle(circleCenter, radius), 
			sinθ2, cosθ2, sinθ1, cosθ1,
			ps[2], ps[0] 
		);				
	}
	
	return arc;
}


/**
 * @description .
 */
function quadrant(sinθ: number, cosθ: number) {
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
function isAngle1LargerOrEqual(
		sinθ1: number, 
		cosθ1: number, 
		sinθ2: number, 
		cosθ2: number) {

	let q1 = quadrant(sinθ1, cosθ1); 
	let q2 = quadrant(sinθ2, cosθ2);
	
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
function isAngleBetween(
		sinθ: number, 
		cosθ: number, 
		sinθ1: number, 
		cosθ1: number, 
		sinθ2: number, 
		cosθ2: number) {
	
	let θ1_larger_θ2 = isAngle1LargerOrEqual(
			sinθ1, cosθ1, sinθ2, cosθ2);
	
	let θ_larger_θ2  = isAngle1LargerOrEqual(
			sinθ, cosθ, sinθ2, cosθ2);
	
	let θ_larger_θ1  = isAngle1LargerOrEqual(
			sinθ, cosθ, sinθ1, cosθ1);
	

	return θ1_larger_θ2 
		? (θ_larger_θ1 || (!θ_larger_θ2))
		: (θ_larger_θ1 && (!θ_larger_θ2));
}


/**
 * 
 */
function lineThroughPointAtRightAngleTo(p: number[], v: number[]) {
	let u = [-v[1], v[0]];
	let p20 = p[0] + u[0];
	let p21 = p[1] + u[1];
	
	return [p, [p20,p21]];
}


/**
 * Get all intersection points between a line and a bezier within a certain t 
 * range.
 */
function getLineBezierIntersectionPoints(
		line: number[][], ps: number[][], tRange: number[]) {
	
	let t = [-line[0][0], -line[0][1]];
	let p = [
	    line[1][0] + t[0],
	    line[1][1] + t[1],
	];
	
	
	// Cache
	let lineLength = Vector.len(p); 
	let sinθ = -p[1] / lineLength;
	let cosθ = p[0] / lineLength;
	

	let newPs = Vector.translateThenRotatePs(
			t, sinθ, cosθ, ps
	);
	
	let roots = Poly.allRoots(Bezier3.getY(newPs), 0, 1);
	
	return roots.map( 
			t => ({ p: Bezier3.evaluate(ps)(t), t })
	);
}


const Geometry = {
	lineLineIntersection,
	getLineBoundaryIntersectionPoints,
	closestSquaredDistanceToRotatedRect,
	getClosestSquareDistanceToRect,
	degAngleFromSinCos,	
	arcFrom3Points,
	quadrant,
	isAngle1LargerOrEqual,
	isAngleBetween,
	lineThroughPointAtRightAngleTo,
	getLineBezierIntersectionPoints
}


export default Geometry;
