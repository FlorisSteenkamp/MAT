'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');

let Vector = require('../../vector/vector.js');
let Memoize = require('../../memoize.js');

let Bezier = require('./bezier.js');
let Circle = require('./circle.js');


/** 
 * @constructor 	
 * 	
 * @param p {number[]} - The point coordinates.
 * @param {ListNode<Bezier>} bezierNode	
 * @param t
 * @param type {MAT_CONSTANTS.pointType} 	
 *  'standard' : 0, // Not special,   	
 *  'sharp'    : 1, // Sharp corner, 	
 *  'dull'     : 2, // dull corner, 	
 * @param {Number} order - For dull corners only; equals the cross of
 * 		  the tangents at the corner interface to impose an order on
 * 		  points with the same point coordinates and t values.   
 * @param {Number} order2 - For points of hole closing 2-prongs only;
 *		  these points are duplicated to split the shape so they need
 *        to be ordered appropriately. 
 * @param {Circle} circle - The osculating circle at this point pointing
 * towards the inside of the shape.
 */	
function PointOnShape(
		bezierNode, t, type, order, order2) {

	this.bezierNode = bezierNode; 	
	this.t          = t;	
	this.type       = type;	
	this.order      = order; 
	this.order2     = order2;
	
	//---- Cache
	let p = Bezier.evaluate(bezierNode.item)(t);
	this.p = p;
	// Removing this cache will help in that if {PointOnShape} is 
	// called as a parameter (where a point is required) it will more 
	// likely result in monomorphic behaviour as opposed to polymorphic 
	// or megamorphic.
	this[0] = p[0];
	this[1] = p[1];
}	
	

PointOnShape.getOsculatingCircle = Memoize.m1(function(pos) {
	if (pos.type === MAT_CONSTANTS.pointType.sharp) {
		return new Circle(pos.p, 0);
	} else if (pos.type === MAT_CONSTANTS.pointType.extreme) {
		let r = MAT_CONSTANTS.maxOsculatingCircleRadius;
		let p = [pos.p[0], pos.p[1] - r];
		return new Circle(p, r);
	}
	return calcOsculatingCircle(
			pos.bezierNode.item, 
			pos.t
	); 
});


/**
 * @description Calculates the osculating circle of the bezier at a 
 * specific t. If it is found to have negative or nearly zero radius
 * it is clipped to have positive radius so it can point into the shape.
 * @param bezier
 * @param t
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


/**
 * @description Compares two PointOnShapes according to its position on
 * the bezier loop.
 */
PointOnShape.compare = function(a,b) {
	if (a === undefined || b === undefined) {
		return undefined;
	}
	
	let res;
	
	res = a.bezierNode.item.indx - b.bezierNode.item.indx;
	if (res !== 0) { return res; }

	res = a.t - b.t;
	if (res !== 0) { return res; }

	res = a.order - b.order;
	if (res !== 0) { return res; }
	
	res = a.order2 - b.order2;
	
	return res;
}


/**
 * @description Returns true if its osculation circle is pointing 
 * straight upwards. 
 */
PointOnShape.isPointingStraightUp = function(pos) {
	let circle = PointOnShape.getOsculatingCircle(pos); 
	if (!circle) { return false; }
	
	let circleDirection = Vector.toUnitVector(
			Vector.fromTo(pos, circle.center)
	);
	
	// If not almost pointing straight up
	if (Math.abs(circleDirection[0]) > 1e-6 || 
		circleDirection[1] > 0) {
		
		return false;
	}
	
	return true;
}


function dullCornerAt(shape, p) {
	let dullCornerHash = shape.dullCornerHash;
	let key = PointOnShape.makeSimpleKey(p); 
	
	return dullCornerHash[key] || null;
}


/**
 * @description Sets the order (to distinguish between points lying on top of each 
 * other) of the contact point if it is a dull corner.
 * @param {PointOnShape} pos
 * @note Modifies pos
 */
PointOnShape.setPointOrder = function(shape, circle, pos) {
	
	let dullCorner = dullCornerAt(shape, pos);
	
	if (!dullCorner) { return; }
	
	let bezier = dullCorner.beziers[0];
	let tan1pre = Bezier.tangent(bezier)(1);
	
	let tan1 = [tan1pre[1], -tan1pre[0]]; // rotate by -90 degrees
	let tan2 = Vector.toUnitVector(
			Vector.fromTo(pos, circle.center)
	);
	
	pos.order = -Vector.dot(tan1, tan2);
	
	return pos.order;
}


/**
 * @description Clones the PointOnShape.
 */
PointOnShape.copy = function(pos) {
	return new PointOnShape(	
			pos.bezierNode, 
			pos.t, 
			pos.type, 
			pos.order, 
			pos.order2 
	);
}


/**
 * @description Creates a string key that only depends on the 
 * PointOnShape's coordinates.
 */
PointOnShape.makeSimpleKey = function(p) {	
	return '' + p[0] + ', ' + p[1]; 		
}


/**
 * @description Returns the PointOnShape type as a human-readable 
 * string.
 * @param type
 * @returns
 */
function typeToStr(type) {
	for (let key in MAT_CONSTANTS.pointType) {
		if (MAT_CONSTANTS.pointType[key] === type) {
			return key;
		}
	}
}


/**
 * @description Returns a human-readable string of the PointOnShape.
 * @note For debugging only.
 */
PointOnShape.toHumanString = function(pos) {
	return '' + pos[0] + ', ' + pos[1] + 
		   ' | bz: '   + pos.bezierNode.item.indx + 
		   ' | t: '    + pos.t + 
		   ' | ord: '  + pos.order + 
		   ' | ord2: ' + pos.order2 + ' | ' +
		   typeToStr(pos.type);
}


module.exports = PointOnShape;
