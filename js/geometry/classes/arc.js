'use strict'

/* 
 * Standard arc class.
 * 
 * If circle === null then the arc degenerates into a line segment 
 * given by sinAngle1 and cosAngle2 which now represent points.
 * 
 * The arc curve is always defined as the piece from angle1 -> angle2.
 * 
 * Note: startpoint and endpoint is redundant 
 */

let Arc = function(
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
 * Returns the closest point on the arc.
 * 
 * @returns { p: number[], position: number } where position is either 
 * 0, 1 or 2 indicating if the closest point is at either endpoint 
 * (1 or 2) or interior to the arc (0). 
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


