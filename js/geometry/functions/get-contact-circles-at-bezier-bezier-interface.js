'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');
let Circle        = require('../../geometry/classes/circle.js');
let PointOnShape  = require('../../geometry/classes/point-on-shape.js');
let Vector        = require('../../vector/vector.js');


//const CROSS_TANGENT_LIMIT = 0.2756 // 16 degrees
//const CROSS_TANGENT_LIMIT = 0.2588 // 15 degrees
//const CROSS_TANGENT_LIMIT = 0.0698 // 4 degrees
//const CROSS_TANGENT_LIMIT = 0.0167 // 1 degree
//const CROSS_TANGENT_LIMIT = 0.0050 // 1/4 degree roughly
const CROSS_TANGENT_LIMIT = 0.0000 // 0 degrees


/** 
 * Get the circles at the bezier-bezier interface points with circle
 * curvature coinciding with the bezier curvature at those points. 
 * 
 * @param {[ListNode<Bezier>]} bezierNodes - The two bezier nodes.
 **/
function getContactCirclesAtBezierBezierInterface(
		bezierNodes, dullCornerHash) {
	
	const ts = [1,0];
	
	let beziers = [0,1].map(function(i) { return bezierNodes[i].item; });
	let tans    = [0,1].map(function(i) { return beziers[i].tangent(ts[i]); });  

	
	let crossTangents = +Vector.cross(tans[0], tans[1]);
	let negDot        = -Vector.dot  (tans[0], tans[1]);
	// The if below is important. Due to floating point approximation
	// it sometimes happen that crossTangents !== 0 but
	// negDot === -1. Remove the if and see what happens. :)
	if (crossTangents === 0 || negDot === -1) {
		// Too close to call 
		// Careful, dullCornerHash might not be set.
		return [];
	}
	
	let p = beziers[0].bezierPoints[3];
	

	if (crossTangents < -CROSS_TANGENT_LIMIT) {  // Sharp corner?

		let pos = new PointOnShape(
			p, 
			bezierNodes[0], 
			1, 
			MAT_CONSTANTS.pointType.sharp, 
			0,
			new Circle(p, 0),
			1+negDot // The higher, the sharper
		); 
		
		return [pos];
	} 
	
	
	if (crossTangents > 0) {
		let key = PointOnShape.makeSimpleKey(p);
		dullCornerHash[key] = { bezier: beziers[0] }; 
		//console.log('a');
	}
	
	if (crossTangents <= CROSS_TANGENT_LIMIT) {
		return [];
	}
	

	//---- Dull corner
	//let oCircles = [];
	let pointsOnShape = [];
	
	let orders = [-1, negDot];
	for (let i=0; i<2; i++) {
		
		let κ = -beziers[i].κ(ts[i]);
		
		let radius = Math.min(
				1/κ, 
				MAT_CONSTANTS.maxOsculatingCircleRadius
		);
		if (radius < 0) {
			// Negative curvature
			radius = MAT_CONSTANTS.maxOsculatingCircleRadius; 
		} 
		
		let normal = beziers[i].normal(ts[i]);
		
		let cc = [
		    p[0] + normal[0]*radius, 
		    p[1] + normal[1]*radius
		];
		
		let pos = new PointOnShape(
			p, 
			bezierNodes[i], 
			ts[i], 
			MAT_CONSTANTS.pointType.dull, 
			orders[i],
			new Circle(cc, radius),
			1+negDot
		);
		
		pointsOnShape.push(pos);	
	}
	
	return pointsOnShape;
}


module.exports = getContactCirclesAtBezierBezierInterface;