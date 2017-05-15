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
