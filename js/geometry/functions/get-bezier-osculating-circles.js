'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');

let Bezier        = require('../classes/bezier.js');
let Circle        = require('../../geometry/classes/circle.js');
let PointOnShape  = require('../../geometry/classes/point-on-shape.js');
let Poly          = require('../../polynomial/polynomial.js');

let calcBezierCurvatureExtremaBrackets = require('./calc-bezier-curvature-extrema.js');


/** 
 * @description Finds the osculating circles for the given bezier. 
 **/
function getBezierOsculatingCircles(bezierNode) {

	let pointsOnShape = [];
	
	let root;
	let bezier = bezierNode.item;
	let brackets = calcBezierCurvatureExtremaBrackets(bezier);
	 
	let lenb = brackets.length;
	for (let k=0; k<lenb; k++) {
		let bracket = brackets[k];
		if (!bracket) { continue; }
		
		let root = lookForRoot(bezier, bracket);
		if (!root) { continue; }
		
		let κ = -Bezier.κ(bezier)(root);
		// Check if local extrema is a maximum or minimum.
		let κAtMinsd = -Bezier.κ(bezier)(bracket[0]);
		let κAtMaxsd = -Bezier.κ(bezier)(bracket[1]);
		
		if (κ > κAtMinsd && κ > κAtMaxsd) {
			// maximum
		} else if (κ <= κAtMinsd && κ <= κAtMaxsd) {
			// minimum
			continue; 
		}
		
		let pos = new PointOnShape(
			bezierNode, 
			root, 
			MAT_CONSTANTS.pointType.standard, 
			0,
			0
		);
			
		pointsOnShape.push(pos);
	}

	pointsOnShape.sort(PointOnShape.compare);
	
	return pointsOnShape;
}


function lookForRoot(bezier, [minsd, maxsd]) {
	
	// At this point there can be exactly 0 or 1 roots within 
	// [minsd, maxsd]
	let c0 = Bezier.dκ(bezier)(minsd);
	let c1 = Bezier.dκ(bezier)(maxsd);
	
	if (c0*c1 >= 0) { return; }
	
	// There is exactly one root in the interval.
	let root = Poly.brent(
			Bezier.dκ(bezier), 
			minsd, maxsd
	);
	
	return root;
}


module.exports = getBezierOsculatingCircles;
