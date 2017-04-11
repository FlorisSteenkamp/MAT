
/** 
 * Basic circle class. 
 */
function Circle(center, radius) {
	this.center = center;
	this.radius = radius;
}


Circle.scale = function(circle, s) {
	return new Circle(circle.center, circle.radius * s)
}


module.exports = Circle;
