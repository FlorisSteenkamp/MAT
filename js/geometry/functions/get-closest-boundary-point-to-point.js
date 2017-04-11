'use strict'

let getClosestPointOnBezierPiece = require('./get-closest-point-on-bezier-piece.js');
let Geometry = require('../geometry.js');
let Vector = require('../../vector/vector.js');
let PointOnShape = require('../classes/Point-on-shape.js');
let MAT_CONSTANTS = require('../../mat-constants.js');

/**
 * Gets the closest boundary point to the given point, limited to the
 * given bezier pieces.
 * 
 * @param {Shape} shape
 * @param {[PointOnShape]} δ - Start and end points for boundary
 *        traversal.
 * @param {Point} point
 * @param {Point} exclPoint Exclude this point and a small 
 *        neighbourhood around it in search. 
 * 
 * @returns {PointOnShape} The closest point.
 */
function getClosestBoundaryPointToPoint(
		bezierPieces_,
		point, 
		exclPoint,
		touchedBezierNode, 
		t,
		_debug_, 
		slog_) {
	

	if (slog_) {
		//console.log('tes')
	}
	const tGap = 0.001; // TODO Make const and put somewhere
	//const tGap = 0.0000001; // TODO Make const and put somewhere
	 
	let bezierPieces = cullBezierPieces(bezierPieces_, point)
 

	let bestDistance = Number.POSITIVE_INFINITY;
	let pos;
	//
	let ii=0;
	//
	for (let bezierPiece of bezierPieces) {
		//
		ii++
		//
		let slog = slog_ && ii === 1;
		let bezier = bezierPiece.bezierNode.item;

		let closestPointAndDistance = getClosestPointOnBezierPiece(
				bezierPiece, 
				point, 
				exclPoint,
				tGap,
				touchedBezierNode,
				t,
				_debug_,
				slog
		);
		
		let { d, p } = closestPointAndDistance;

		if (d < bestDistance) {
			//if (slog_) { console.log(ii, d); }
			pos = new PointOnShape(
					p.p,
					bezierPiece.bezierNode, 
					p.t, 
					MAT_CONSTANTS.pointType.standard, 
					0,
					undefined // TODO!! aaa
			);
			bestDistance = d;
		}
	}
	
	//if (bestDistance > 10000) { console.log('aaaaaaaaaaaaaaa'); }
	
	return pos;
}


function cullBezierPieces(bezierPieces,	p) {
	
	const CULL_THRESHOLD = 5; // TODO Put somewhere better.
	
	let shortCircuit = bezierPieces.length > CULL_THRESHOLD;
	if (shortCircuit) {
		// First get an initial point such that the closest point 
		// can not be further than this point.
		let bestSquaredDistance = getClosePoint(
				bezierPieces, p
		);
		bezierPieces = cullByLooseBoundingBox(
				bezierPieces, p,
				bestSquaredDistance
		);
		bezierPieces = cullByTightBoundingBox(
				bezierPieces, p,
				bestSquaredDistance
		);
	}
	
	return bezierPieces;
}

/**
 * Finds an initial point such that the closest point
 * can not be further than this point.
 */ 
function getClosePoint(bezierPieces, p) {
	let bestSquaredDistance = Number.POSITIVE_INFINITY;
	for (let bezierPiece of bezierPieces) {
		let bezier = bezierPiece.bezierNode.item;
		
		let p1 = bezier.evaluate( bezierPiece.tRange[0] );
		let p2 = bezier.evaluate( bezierPiece.tRange[1] );
		
		let d1 = Vector.squaredDistanceBetween(p, p1);
		let d2 = Vector.squaredDistanceBetween(p, p2);
		let d = Math.min(d1,d2); 
		
		if (d < bestSquaredDistance) {
			bestSquaredDistance = d;  
		}
	}
	
	// The extra bit is to account for floating point precision 
	// TODO change 0.01 below to more meaningfull value dependent on 
	// shape dimensions, etc.
	return bestSquaredDistance + 0.01;
}


/**
 * When checking distances, ignore all those with closest 
 * possible distance further than 'bestSquaredDistance',
 * i.e. cull them.
 */
function cullByLooseBoundingBox(
		bezierPieces,
		p,
		bestSquaredDistance) {

	let candidateBezierPieces = [];
	
	for (let bezierPiece of bezierPieces) {
		let bezier = bezierPiece.bezierNode.item;
		
		let looseBoundingBox = bezier.getBoundingBox();
		let d = Geometry.getClosestSquareDistanceToRect(
				looseBoundingBox,
				p
		);
		if (d <= bestSquaredDistance) {
			candidateBezierPieces.push(bezierPiece);
		} 
	}
	
	return candidateBezierPieces;
}


/**
 * When checking distances, ignore all those with closest 
 * possible distance further than 'bestSquaredDistance',
 * i.e. cull them.
 */
function cullByTightBoundingBox(
		bezierPieces, 
		p,
		bestSquaredDistance) {
	
	let candidateBezierPieces = []; 

	for (let bezierPiece of bezierPieces) {
		let bezier = bezierPiece.bezierNode.item;
		
		let tightBoundingBox = bezier.getBoundingBoxTight();
		let d = Geometry.closestSquaredDistanceToRotatedRect(
				bezier,
				p
		);
		if (d <= bestSquaredDistance) {
			candidateBezierPieces.push(bezierPiece);
		} 
	} 
	
	return candidateBezierPieces;
}

module.exports = getClosestBoundaryPointToPoint;













