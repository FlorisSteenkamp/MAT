'use strict'

let PointOnShape = require('../../../geometry/classes/point-on-shape.js');


function ThreeProngForDebugging(
		threeProng, deltas, bestIndx, candidateThreeProngs) {

	this.threeProng = threeProng;
	this.deltas     = deltas; 
	this.bestIndx   = bestIndx;
	this.candidateThreeProngs = candidateThreeProngs;

	this.deltasSimple = deltas.map(function(delta) {
		return [
			PointOnShape.toHumanString( delta[0].item.pointOnShape ),
			PointOnShape.toHumanString( delta[1].item.pointOnShape )
		]; 
	});
}


module.exports = ThreeProngForDebugging;
