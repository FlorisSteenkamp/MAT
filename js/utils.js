'use strict'

/**
 * Utililty class
 */
let Util = {};


Util.min = function(xs) {
	return Math.min.apply(null, xs);
}
	

Util.max = function(xs) {
	return Math.max.apply(null, xs);
}


/**
 * Floating-point safer version of acos. If θ is only slightly larger
 * than 1 (or smaller than -1), still return 0 (or Math.Pi) instead of 
 * NAN. 
 */
Util.acos = function(θ) {
	let SLIGHTLY = 0.01;
	
	if (θ > 1 && θ < 1+SLIGHTLY) {
		return 0;
	} else if (θ < -1 && θ > -1-SLIGHTLY) {
		return Math.PI;
	}
	
	return Math.acos(θ);
}


module.exports = Util;