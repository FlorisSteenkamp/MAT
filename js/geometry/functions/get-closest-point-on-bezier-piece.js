'use strict'

let Geometry = require('../geometry.js');
let Vector   = require('../../vector/vector.js');

/**
 * 
 */
function getClosestPointOnBezierPiece(
		bezierPiece, point, exclPoint, 
		tGap, touchedBezierNode, t, _debug_, slog) {
	
	if (_debug_) {
		_debug_.cpCalcs++;
	}
	
	let bezierNode = bezierPiece.bezierNode;

	let tRanges = [bezierPiece.tRange];
	
	let p = Geometry.closestPointBetween_PointAndBezier(
			bezierNode, point, bezierPiece.tRange, touchedBezierNode, t, 
			_debug_, slog
	);

	if (!p) {
		return { d: Number.POSITIVE_INFINITY, p: undefined, };
	}
	
	let d = Vector.distanceBetween(p.p, point);

	return { d, p };
}

module.exports = getClosestPointOnBezierPiece;









