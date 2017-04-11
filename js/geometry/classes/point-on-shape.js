'use strict'

let MAT_CONSTANTS = require('../../mat-constants.js');
let Vector        = require('../../vector/vector.js');


/** 
 * @constructor 	
 * 	
 * @param p {number[]} - The point coordinates.
 * @param {ListNode<Bezier>} bezierNode	
 * @param t
 * @param type {MAT_CONSTANTS.pointType} 	
 *  'osculating'        : 0, // Osculating - Max curvatre inward,   	
 *  'sharp'             : 1, // Sharp corner, 	
 *  'dull'              : 2, // dull corner, 	
 *  'reverseOsculating' : 3, // Osculating - Max curvature outward, 	
 *  'standard'          : 4, // just another point
 * @param {Number} order - For dull corners only; equals the cross of
 * 		  the tangents at the corner interface to impose an order on
 * 		  points with the same point coordinates or t values.   
 * @param {Circle} circle - The osculating circle at this point.
 * @param {Number} sharpness - Measure of corner sharpness.
 *   	
 */	
// TODO - The order property should be a property of ContactPoint instead.
let PointOnShape = function(
		p, bezierNode, t, type, order, osculatingCircle, sharpness) {
	
	this.bezierNode = bezierNode; 	
	this.t = t;	
	this.type = type;	
	this.order = order; // z-order order arbitration decider to make all points on the shape well-ordered
	this.osculatingCircle = osculatingCircle;
	this.sharpness = sharpness;
	//if (sharpness) { console.log(sharpness); }
	
	this.simpleKey = PointOnShape.makeSimpleKey(p);
	//this.p = p; // TODO - see below
	
	//---- Cache
	// Removed 2 lines below - if {PointOnShape} is called as parameter 
	// it will more likely result in monomorphic behaviour as opposed 
	// to polymorphic or megamorphic
	this[0] = p[0];
	this[1] = p[1];
	this.key = PointOnShape.toString(this);	
}	
	

function dullCornerAt(shape, p) {

	let dullCornerHash = shape.dullCornerHash;
	let key = PointOnShape.makeSimpleKey(p); // First point
 
	let result = dullCornerHash[key] || null;
	
	//console.log(result);

	return result;
}


/**
 * Sets the order (to distinguish between points lying on top of each 
 * other) of the contact point if it is a dull corner.
 *
 * Notes: Modifies p
 * 
 * @param {PointOnShape} p 
 * 
 */
PointOnShape.setPointOrder = function(shape, circle, p, _debug_) {
	
	let dullCorner = dullCornerAt(shape, p);
	
	if (!dullCorner) { return; /* or use different scheme */ }
	
	//let bez = dullCorner.pointOnShape.bezierNode.item;
	let bez = dullCorner.bezier;
	let tan1pre = bez.tangent(1);
	
	let tan1 = [tan1pre[1], -tan1pre[0]]; // rotate by -90 degrees
	let tan2 = Vector.toUnitVector(
			Vector.fromTo(p, circle.center)
	);
	
	let crossTangents = -Vector.dot(tan1, tan2);

	p.order = crossTangents;
	p.key = PointOnShape.toString(p);
	
	if (_debug_) {
		// TODO Add a _debug_ flag to switch this on or off.
		if (_debug_.drawStuff) {
			if (dullCorner) {
				//_debug_.draw.line([p, circle.center], 'red thin5');
			}
		}
	}
	
	return p.order;
}

	
/**	
 * Return a new point on the shape from given point shifted by a given t distance	
 * 	
 * Δt The distance to shift the point	
 * 	
 * @return {PointOnShape} Shifted point  	
 */	
PointOnShape.shift = function(p, Δt) {

	if (Δt <= -1 || Δt >= 1) {	
		// TODO: relatively easy to support the case where Δt can by any {Number}	
		throw 'Δt not in range (-1, 1); Δt was ' + Δt; 	
	}	
		
	let newBezierNode = p.bezierNode; 	
	

	let t = p.t + Δt;	
	if (t < 0) {	
		t = t + 1;	
		newBezierNode = newBezierNode.prev; 	
	} else if (t > 1) {	
		t = t - 1;	
		newBezierNode = newBezierNode.next;	
	}	
		
	//console.log(p.t, Δt, t, newBezierNode.item.evaluate(t));	
		
	return new PointOnShape(	
			newBezierNode.item.evaluate(t),	
			newBezierNode,	
			t, 	
			MAT_CONSTANTS.pointType.standard,	
			0 /* order */	
	);	
}	
	

PointOnShape.cloneAndAdv = function(p) {
	return new PointOnShape(	
			p.bezierNode.item.evaluate(p.t),	
			p.bezierNode,	
			p.t, 	
			p.type,	
			p.order + (p.order / 111111111111) // hack  	
	);
}

	
/**	
 * Takes a single point and splits it and moves it apart along shape boundary.	
 * 	
 * @param p {PointOnShape} pointOnShape 
 * @param Δt {Number} The distance (in t) to move the points apart. Ideally we would	
 *        much prefer a pixel distance, but the implementation would be more complex. 	
 * 	
 * @return Splitted points as array, i.e. [p1,p2]	
 */	
PointOnShape.split = function(p, Δt) {	
	return [	
		PointOnShape.shift(p, -Δt),	
		PointOnShape.shift(p, +Δt)	
	]	
}	


PointOnShape.splitForward = function(p, Δt) {	
	return [	
		p,	
		PointOnShape.shift(p, +2*Δt)	
	]	
}

PointOnShape.splitBack = function(p, Δt) {	
	return [	
		PointOnShape.shift(p, -2*Δt),	
		p	
	]	
}
	
	

function typeToStr(type) {
	for (let key in MAT_CONSTANTS.pointType) {
		if (MAT_CONSTANTS.pointType[key] === type) {
			return key;
		}
	}
	
	return undefined;
}

PointOnShape.toString = function(p) {	
	return '' + p[0] + ', ' + p[1] + '|' + p.order + '|' + p.type;
}


PointOnShape.toHumanString = function(p) {
	let str =  '' + p[0] + ', ' + p[1] + 
			   ' | bz: '  + p.bezierNode.item.indx + 
			   ' | t: '   + p.t + 
			   ' | ord: ' + p.order + ' | ';
	return str + typeToStr(p.type);
}


PointOnShape.makeSimpleKey = function(p) {	
	return '' + p[0] + ', ' + p[1]; 		
}


PointOnShape.compare = function(a,b) {
	var res = a.bezierNode.item.indx - b.bezierNode.item.indx;
	
	if (res !== 0) { return res; }

	res = a.t - b.t;
	if (res !== 0) { return res; }

	return a.order - b.order;
}	


module.exports = PointOnShape;








