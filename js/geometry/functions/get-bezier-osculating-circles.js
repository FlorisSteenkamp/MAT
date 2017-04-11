'use strict'

let Bezier = require('../classes/bezier.js');
let calcBezierCurvatureExtremaBrackets = require('./calc-bezier-curvature-extrema.js');
let MAT_CONSTANTS = require('../../mat-constants.js');
let Circle        = require('../../geometry/classes/circle.js');
let PointOnShape  = require('../../geometry/classes/point-on-shape.js');
let Poly          = require('../../polynomial/polynomial.js');

const BRENT_TOLERANCE = 1e-12;

/** 
 * Finds the osculating circles for the given bezier. 
 **/
function getBezierOsculatingCircles(bezierNode) {

	let pointsOnShape = [];
	
	var root;
	let bezier = bezierNode.item;
	var brackets = calcBezierCurvatureExtremaBrackets(bezier);
	 
	var lenb = brackets.length;
	for (var k=0; k<lenb; k++) {
		let bracket = brackets[k];
		if (!bracket) { continue; }
		
		let root = lookForRoot(bezier, bracket);
		if (!root) { continue; }
		
		let pointDetails = getCircleAtRoot(bezier, root, bracket);
		if (!pointDetails) { continue; }
		
		let { p, circle, type } = pointDetails;
		let pos = new PointOnShape(
			p, 
			bezierNode, 
			root, 
			type, 
			0,
			circle
		);
			
		//oCircles.push(oCircle);
		pointsOnShape.push(pos);
	}

	// TODO - maybe just add them in the correct order to start with
	/*
	oCircles.sort(function(a,b) {
		return PointOnShape.compare(a.pointOnShape, b.pointOnShape);
	});
	*/
	pointsOnShape.sort(PointOnShape.compare);
	
	//return oCircles;
	return pointsOnShape;
}


function lookForRoot(bezier, [minsd, maxsd]) {
	
	// At this point there can be exactly 0 or 1 roots within [minsd, maxsd]
	let c0 = bezier.dκ(minsd);
	let c1 = bezier.dκ(maxsd);
	
	if (c0*c1 >= 0) { return; }
	
	// There is exactly one root in the interval.
	let root = Poly.brent(
			bezier.dκ, 
			minsd, maxsd/*, 
			BRENT_TOLERANCE*/
	);
	
	return root;
}


function getCircleAtRoot(bezier, root, [minsd, maxsd]) {	
	// TODO - still need to determine curve orientation
	let κ = -bezier.κ(root); 

	if (κ > 0) {
		// Bending inwards.
		
		// Check if local extrema is a maximum or minimum.
		let κAtMinsd = -bezier.κ(minsd);
		let κAtMaxsd = -bezier.κ(maxsd);
		
		if (κ > κAtMinsd && κ > κAtMaxsd) {
			// maximum
		} else if (κ <= κAtMinsd && κ <= κAtMaxsd) {
			// minimum
			// TODO Good point for 2-prong?
			return; 
		} 
	}
	
	
	let radius;
	let type;
	if (κ < 0) { 
		// Curving wrong way, but probably a significant point to 
		// put a 2-prong.
		radius = MAT_CONSTANTS.maxOsculatingCircleRadius;
		type = MAT_CONSTANTS.pointType.reverseOsculating; // 3
	} else {
		radius = Math.min(
				1/κ, 
				MAT_CONSTANTS.maxOsculatingCircleRadius
		);
		type = MAT_CONSTANTS.pointType.osculating;
	}
	
	let normal = bezier.normal(root);
	let p = bezier.evaluate(root);
	let cc = [
		p[0] + normal[0]*radius, 
		p[1] + normal[1]*radius
	];

	let circle = new Circle(cc, radius);
	 
	return { p, circle, type };  
}


module.exports = getBezierOsculatingCircles;