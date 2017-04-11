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