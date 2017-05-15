'use strict'


function TwoProngForDebugging(
		pos, δ, y, z, x, circle, xs, failed, holeClosing) {

	this.pos    = pos;
	this.δ      = δ;
	this.y      = y;
	this.z      = z;
	this.x      = x;
	this.circle = circle;
	this.xs     = xs;
	this.failed = failed;
	this.holeClosing = holeClosing;
}


module.exports = TwoProngForDebugging;
