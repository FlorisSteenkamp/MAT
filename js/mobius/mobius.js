'use strict'

let Poly = require('../polynomial/polynomial.js');


/** 
 * Mobius class
 * @constructor
 * 
 * The below parameters are the coefficients of the Mobius 
 * transformation (ax + b) / (cx + d).
 * @param a {Number}
 * @param b {Number}
 * @param c {Number}
 * @param d {Number}
 */
function Mobius(numer, denom) {
	this.numer = numer; //[a,b]; // Represents the numerator polynomial
	this.denom = denom; //[c,d]; // ... denominator ...
}


Mobius.changeVariables = function(mobius, a, b) {
	return new Mobius(
		Poly.changeVariables(mobius.numer, a, b), 
		Poly.changeVariables(mobius.denom, a, b)
	);
}


Mobius.invert = function(mobius) {
	return new Mobius(
		[mobius.numer[1], mobius.numer[0]], 
		[mobius.denom[1], mobius.denom[0]]
	);
}


Mobius.evaluateAt0 = function(mobius) {
	return mobius.numer[1] / mobius.denom[1];
}


Mobius.evaluateAtInf = function(mobius) {
	return mobius.numer[0] / mobius.denom[0];
}


Mobius.evaluate = function(mobius, t) {
	return Poly.evaluate(mobius.numer)(t) / 
	       Poly.evaluate(mobius.denom)(t);
}


module.exports = Mobius;
