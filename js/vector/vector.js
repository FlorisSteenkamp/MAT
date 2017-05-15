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
 * @param {[[Number, Number]]} ps 
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
 * @description
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
 * @returns
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
