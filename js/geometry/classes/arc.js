/** 
 * Standard arc class.
 * 
 * If circle === null then the arc degenerates into a line segment 
 * given by sin_angle1 and cos_angle2 which now represent points.
 * 
 * The arc curve is always defined as the piece from angle1 -> angle2.
 * 
 * Note: startpoint and endpoint is redundant 
 */

let Arc = function(
		circle, 
		startpoint, endpoint, 
		sin_angle1, cos_angle1, 
		sin_angle2, cos_angle2) {
	
	this.circle = circle;
	this.startpoint = startpoint; // Redundant but useful
	this.endpoint   = endpoint;	  // Redundant but useful	
	this.sin_angle1 = sin_angle1;
	this.sin_angle2 = sin_angle2;
	this.cos_angle1 = cos_angle1;
	this.cos_angle2 = cos_angle2;
}
	

module.exports = Arc;


