'use strict'

let Vector          = require('../../vector/vector.js');


/** 
 * @constructor
 * Basic circle class. 
 */
function Circle(center, radius) {
	this.center = center;
	this.radius = radius;
}


/**
 * @description Returns a scaled version of the given circle without
 * changing its center position.
 * @returns {Circle} The scaled circle.
 */
Circle.scale = function(circle, s) {
	return new Circle(circle.center, circle.radius * s)
}


/** 
 * @returns {boolean} true if the first circle engulfs the second.
 */
Circle.engulfsCircle = function(c1, c2) {
	if (c1.radius <= c2.radius) { 
		return false; 
	}
	
	let d = Vector.squaredDistanceBetween(c1.center, c2.center);
	let dr = c1.radius - c2.radius; 
	let δ = dr*dr;

	return δ > d;
}


/**
 * @description Returns a human-readable string description.
 * @note For debugging only.
 */
Circle.prototype.toString = function() {
	return 'c: ' + this.center + ' radius: ' + this.radius;
}


module.exports = Circle;
