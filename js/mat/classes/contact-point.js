'use strict'

let PointOnShape = require('../../geometry/classes/point-on-shape.js');
let Vector = require('../../vector/vector.js');


/** 
 * @description Class representing a single contact point of a MatCircle 
 * instance. 
 * @onstructor
 *
 * @param {PointOnShape} pointOnShape
 * @param {MatCircle} matCircle 
 */
function ContactPoint(pointOnShape, matCircle) {
	this.pointOnShape = pointOnShape;
	this.matCircle    = matCircle;
	this.key = PointOnShape.toHumanString(pointOnShape); // TODO
	
	this[0] = pointOnShape[0]; // Shortcut
	this[1] = pointOnShape[1]; // ...
}


ContactPoint.compare = function(a,b) {
	return PointOnShape.compare(a.pointOnShape, b.pointOnShape); 
} 


ContactPoint.equal = function(a,b) {
	return Vector.equal(a,b);
}


module.exports = ContactPoint;
