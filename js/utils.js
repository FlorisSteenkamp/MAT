'use strict'

/**
 * Utililty class
 */
let Util = {};


/**
 * General function to get best item in array and return it. Best is
 * defined as the lowest value returned by the supplied binary function.
 */
Util.bestBy = function(xs, f_) {
	let result;
	let f = f_ || (x => x); 
	
	let best = Number.POSITIVE_INFINITY; 
	for (let x of xs) {
		let d = f(x); 
		if (d < best) {
			result = x;
			best = d; 
		} 
	}
	
	return result;
}


Util.min = function(xs) {
	return Math.min.apply(null, xs);
}
	

Util.max = function(xs) {
	return Math.max.apply(null, xs);
}


module.exports = Util;