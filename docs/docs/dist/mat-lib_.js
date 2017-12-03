'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');

let Vector = require('../../vector/vector.js');
let Memoize = require('../../memoize.js');

let Bezier = require('./bezier.js');
let Circle = require('./circle.js');


 /*
  * Adds two values.
  *
  * @func
  * @memberOf R
  * @since v0.1.0
  * @category Math
  * @sig Number -> Number -> Number
  * @param {Number} a
  * @param {Number} b
  * @return {Number}
  * @see R.subtract
  * @example
  *
  *      R.add(2, 3);       //=>  5
  *      R.add(7)(10);      //=> 17
  */
 
/**
 * @description Calculates the osculating circle of the bezier at a 
 * specific t. If it is found to have negative or nearly zero radius
 * it is clipped to have positive radius so it can point into the shape.
 *
 * @memberOf Math
 * @param {Bezier} bezier
 * @param {number} t
 * @returns {Circle}
 */
function calcOsculatingCircle(bezier, t) {	
	let κ = -Bezier.κ(bezier)(t); 

	// If (κ > 0) { Bending inwards. }
	
	let radius;
	if (κ <= 1/MAT_CONSTANTS.maxOsculatingCircleRadius) { 
		// Curving wrong way (or flat, or too big), but probably a 
		// significant point to put a 2-prong.
		radius = MAT_CONSTANTS.maxOsculatingCircleRadius;
	} else {
		radius = Math.min(
				1/κ, 
				MAT_CONSTANTS.maxOsculatingCircleRadius
		);
	}
	
	let normal = Bezier.normal(bezier)(t);
	let p = Bezier.evaluate(bezier)(t);
	let circleCenter = [
		p[0] + normal[0]*radius, 
		p[1] + normal[1]*radius
	];

	return new Circle(circleCenter, radius);
}







