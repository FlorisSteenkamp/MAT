'use strict'

let Util = require('../..//utils.js');
let Circle = require('../../geometry/classes/circle.js');
let Geometry = require('../../geometry/geometry.js');
let Vector = require('../../vector/vector.js');
let getClosestBoundaryPointToPoint = 
	require('../../geometry/functions/get-closest-boundary-point-to-point.js');
let PointOnShape = require('../../geometry/classes/point-on-shape.js');


let calcVectorToZeroV_StraightToIt = Vector.fromTo;


function calcVectorToZeroV_AlongMedial(circleCenter, ps, _debug_) {
	let v1 = Vector.fromTo(ps[0], ps[2]); 
	let v2 = [-v1[1], v1[0]]; // Rotate by 90 degrees
	let l1 = Vector.length(Vector.fromTo(x, circleCenter));
	let v3 = Vector.toUnitVector(v2);
	let v4 = Vector.scale(v3, l1);
	if (_debug_) {
		_debug_.draw.line([x, Vector.translate(x,vectorToZeroV)], 'thin10 red');
		_debug_.draw.line([x, Vector.translate(x,v4)], 'thin10 blue');
	}
	
	return v4;			
}


/**
 * Look for a 3-prong from the given walked boundary piece.
 *
 * @param {Shape} shape
 * @param {[ContactPoint]} deltas
 * 
 */ 
function find3Prong(shape, deltas, _debug_) {
	
	let bezierPiecess = deltas.map(function(δ) {
		return Geometry.getBoundaryPieceBeziers(shape, δ);
	});

	
	let bps; // Best ps
	let bx;
	
	let dbgInfo;
	if (_debug_) { dbgInfo = { cs: [] }; }

	
	let iindx;
	let smallestRadiusDelta = Number.POSITIVE_INFINITY;
	for (let i=1; i<deltas.length-1; i++) {
		
		let { radiusDelta, ps, x } = find3ProngForDelta3s(
			shape, deltas, i, bezierPiecess, 
			dbgInfo, _debug_
		);
		
		if (radiusDelta < smallestRadiusDelta) {
			smallestRadiusDelta = radiusDelta;
			iindx = i;
			bps = ps;
			bx = x;
		}
	}

	
	let totDist = 
		Vector.distanceBetween(bx, bps[0]) + 
		Vector.distanceBetween(bx, bps[1]) + 
		Vector.distanceBetween(bx, bps[2]);

	let circle = new Circle(bx, totDist/3);
	
	let delta3s = [deltas[0], deltas[iindx], deltas[deltas.length-1]];
	

	let threeProng = { delta3s, circle, ps: bps };
	
	if (_debug_) { 
		add3ProngForDebugging(
			threeProng, deltas, iindx, dbgInfo, bps, _debug_
		); 
	}
	
	return threeProng;
}


/**
 * Finds a 3-prong using only the 3 given delta's.
 * 
 * @param i - Specific delta indx.
 * @returns
 */
function find3ProngForDelta3s(
		shape, deltas, idx, bezierPiecess, dbgInfo, _debug_) {
	
	// TODO - Choose a tolerance relative to shape size.
	const TOLERANCE = 1e-7;
	
	let delta3s = [
		deltas[0], 
		deltas[idx], 
		deltas[deltas.length-1]
	];
	
	let bezierPiece3s = [
		bezierPiecess[0], 
		bezierPiecess[idx], 
		bezierPiecess[deltas.length-1]
	];
	

	let ps;
	let circleCenter;
	let ii = 0; // Safeguard
	let x = calcInitial3ProngPoint(shape, delta3s, bezierPiece3s, _debug_);
	let tolerance = Number.POSITIVE_INFINITY;
	// TODO 10 below is magic, fix or add somewhere as a constant
	while (tolerance > TOLERANCE && ii < 10) { 
		ii++;
		
		ps = getClosestPoints(x, bezierPiece3s, _debug_);
		circleCenter = myCircumCenter(ps, _debug_);
	
		let vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circleCenter);
		//let vectorToZeroV = calcVectorToZeroV_AlongMedial (x, circleCenter, ps);
		
		let upds = calcBetterX(bezierPiece3s, x, vectorToZeroV, _debug_);
		x = upds.newX;
		
		let V = Vector.length(vectorToZeroV);
		ps = upds.newPs;
		
		tolerance = Math.abs(V - upds.newV);
	}


	// CircumCircle radius
	let radius = Vector.length(Vector.fromTo(ps[0], circleCenter));
	
	let closestDs = [];
	for (let i=0; i<bezierPiecess.length; i++) {
		let p = getClosestBoundaryPointToPoint(
				bezierPiecess[i],
				circleCenter, 
				undefined, // exclPoint,
				undefined, // bezierNode
				undefined, // t
				_debug_
		);
		
		closestDs.push(Vector.length(Vector.fromTo(p, circleCenter)));
	}

	let closestD = Util.bestBy(closestDs);
	let radiusDelta = radius - closestD;
	
	if (_debug_) {
		dbgInfo.cs.push({ ps, x, ccr: radius, indxi: idx });
	}
	
	return { radiusDelta, ps, x };
}


/**
 * Find new x and ps that are a better estimate of the 3-prong  
 * circle.
 * 
 * The potential function, V, is defined as the distance to the 
 * actual 3 prong circle center.
 */
function calcBetterX(
		bezierPiece3s, x, vectorToZeroV, _debug_) {
	
	let V = Vector.length(vectorToZeroV);
	
	let nu = 1;
	let better;
	let newX;
	let newPs;
	let newV;
	let i = 0; // Safeguard
	do { 
		let shift = Vector.scale(vectorToZeroV, nu);
		newX = Vector.translate(x, shift); 
		
		newPs = getClosestPoints(newX, bezierPiece3s, _debug_);
					
		// Point of zero V
		let newCircleCenter = myCircumCenter(newPs, _debug_); 
		let newVectorToZeroV = Vector.fromTo(newX, newCircleCenter);
		newV = Vector.length(newVectorToZeroV);
		
		better = newV < V;
		
		nu = nu/2;
		
		i++;
	} while (!better && i < 3);
	//console.log(i); 
	
	return { newX, newV, newPs } 
}



/**
 * Finds an initial 3-prong circle center point from which to iterate.
 * The point must be within the shape. 
 * 
 * @param {[ContactPoint]} delta3s - The three boundary pieces of which
 *        we need to find the three 3-prong points.
 * @returns
 */
function calcInitial3ProngPoint(
		shape, delta3s, bezierPiece3s, _debug_) {

	// TODO - No need to calculate, we already have this info somewhere.
	let twoProngCircleCenter = 
		Vector.mean([delta3s[0][0].item, delta3s[2][1].item]); 
	let point1 = getClosestBoundaryPointToPoint(
			bezierPiece3s[1],
			twoProngCircleCenter, 
			undefined, // exclPoint,
			undefined, // bezierNode
			undefined, // t
			_debug_
	);
	
	
	let meanPoints = [
		delta3s[0][0].item, 
		//Vector.mean([delta3s[1][0].item, delta3s[1][1].item]),
		point1,
		delta3s[2][1].item,
	];
	
	
	let p; 
	if (delta3s[0][0].item.pointOnShape.type === 1) {
		// delta3s start and end at sharp corner.
		// If delta3s start at a sharp corner it will end there also
		// so no need to check for end point as well.
		p = Vector.mean([meanPoints[0], meanPoints[1]]);
	} else {
		p = Vector.circumCenter(meanPoints);
	}
	
	
	if (!Number.isFinite(p[0])) {
		if (_debug_) {
			// TODO - check why this actuall happens sometimes
			//console.log(_debug_.pointsToNiceStr(meanPoints));
			//console.log(_debug_.deltasToNiceStr(delta3s));
			//console.log(p, meanPoints);
		}
	}
	if (!Number.isFinite(p[0])) {
		let sames = whichNotSame(meanPoints);
		return Vector.mean([meanPoints[sames[0]], meanPoints[sames[1]]]);
	}
	
	return p;
	
}


function add3ProngForDebugging(
		threeProng, deltas, iindx, dbgInfo, bps, _debug_) {
	
	_debug_.nProngs.push(threeProng);
	
	dbgInfo.deltas = deltas; 
	dbgInfo.deltasSimple = deltas.map(function(delta) {
		return [
			PointOnShape.toHumanString(delta[0].item.pointOnShape),
			PointOnShape.toHumanString(delta[1].item.pointOnShape)
		]; 
	});
	dbgInfo.iindx = iindx;
	

	if (_debug_.drawStuff) {
		for (let i=0; i<bps.length;i++) {
			let p = bps[i];
			_debug_.draw.dot(p, 0.1*(i+1), 'blue');
		}
	}
	
	if (_debug_.drawStuff) {
		// This is a MAT point!
		_debug_.draw.dot(threeProng.circle.center, 0.3, 'blue'); 
		
		_debug_.draw.circle(
				threeProng.circle,
				'blue thin1 nofill'
		);
	}
}


function whichNotSame(ps) {
	if (ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1]) {
		return [0,2];
	} else if (ps[1][0] === ps[2][0] && ps[1][1] === ps[2][1]) {
		return [0,2];
	} else if (ps[2][0] === ps[0][0] && ps[2][1] === ps[0][1]) {
		return [1,2];
	};
	
	return []; 
}


function getClosestPoints(x, bezierPiece3s, _debug_) {

	return bezierPiece3s.map(function(bezierPieces) {
		
		let p = getClosestBoundaryPointToPoint(
				bezierPieces,
				x, 
				undefined, // exclPoint,
				undefined, // bezierNode
				undefined, // t
				_debug_
		);
		
		return p; 
	});
}


/**
 * 
 * @param ps
 * @param _debug_
 * @returns
 * 
 * NOTES: Intead of using splitBack, split and splitForward, we should
 *        use the tangents at the inward cone.
 */
function myCircumCenter(ps, _debug_) {
	//return Vector.circumCenter(ps);
	
	
	const minD = 0.0005; // Keep this smaller than 2-prong gaps?
	const tGap = 0.0005;
	
	let l1 = Vector.distanceBetween(ps[0], ps[1]);
	let l2 = Vector.distanceBetween(ps[1], ps[2]);
	let l3 = Vector.distanceBetween(ps[2], ps[0]);
	
	
	let indxs;
	if (l1 < minD) {
		indxs = [0,1,2];
	} else if (l2 < minD) {
		indxs = [1,2,0];
	} else if (l3 < minD) {
		indxs = [2,0,1];
	}
 
	if (indxs) {
	
		let newPs = [
			
			PointOnShape.splitBack   (ps[indxs[0]], tGap),
			PointOnShape.split       (ps[indxs[0]], tGap),
			PointOnShape.splitForward(ps[indxs[0]], tGap),
			
			/*
			PointOnShape.splitForward(ps[indxs[0]], tGap),
			PointOnShape.splitForward(ps[indxs[0]], tGap),
			PointOnShape.splitForward(ps[indxs[0]], tGap),
			*/
		];	

		
		//return Vector.circumCenter([newPs[0][0], newPs[0][1], ps[indxs[2]]]);
		
		
		let ccs = newPs.map(function(newP) {
			return Vector.circumCenter([newP[0], newP[1], ps[indxs[2]]]);
		});
		
		let idx = 0;
		let minD = Number.POSITIVE_INFINITY;
		for (let i=0; i<3; i++) {
			let d = Vector.distanceBetween(ccs[i], ps[indxs[2]]);
			if (d < minD) {
				minD = d;
				idx = i;
			}
		}
		
		
		return ccs[idx];
	}
	
	
	
	return Vector.circumCenter(ps);
}


function myCircumCenter1(ps, _debug_) {
	//return Vector.circumCenter(ps);
	
	
	const minD = 0.0005; // Keep this smaller than 2-prong gaps?
	const tGap = 0.0005;
	
	let l1 = Vector.distanceBetween(ps[0], ps[1]);
	let l2 = Vector.distanceBetween(ps[1], ps[2]);
	
	
	let indxs;
	//if (l1 < minD) {
	if (l1 === 0) {
		let newPs = PointOnShape.splitForward(ps[0], tGap);
		return Vector.circumCenter([newPs[0], newPs[1], ps[2]]);
	//} else if (l2 < minD) {
	} else if (l2 === 0) {		
		let newPs = PointOnShape.splitBack(ps[0], tGap);
		return Vector.circumCenter([newPs[0], newPs[1], ps[2]]);
	} 
	
	return Vector.circumCenter(ps);
}


/*
function whichSame(ps) {
	if (ps[0][0] === ps[1][0] && ps[0][1] === ps[1][1]) {
		return [0,1];
	} else if (ps[1][0] === ps[2][0] && ps[1][1] === ps[2][1]) {
		return [1,2];
	} else if (ps[2][0] === ps[0][0] && ps[2][1] === ps[0][1]) {
		return [2,0];
	};
	
	return []; 
}
*/


/** 
 * Resolve ps (as in stellar) if they are too close together, 
 * i.e. same point.
 */
/*
function resolvePs(ps) {
	
	let sames = whichSame(ps);
	if (sames.length === 0) {
		return ps;
	}
	

	let pps = [];
	let s0 = sames[0];
	let s1 = sames[1];
	let abit = 0.0000001; 
	//let abit = 0.01; 
	
	pps = ps.slice();
	
	if (pps[s0].t < abit) {
		if (pps[s1].t + abit > 1) {
			[s0,s1] = [s1,s0];
		}
		pps[s1] = PointOnShape.shift(ps[s1], abit);
	} else {
		if (pps[s0].t < abit) {
			[s0,s1] = [s1,s0];
		}
		pps[s0] = PointOnShape.shift(ps[s0], -abit);
	}
	
	return pps;
}
*/


module.exports = find3Prong;

// 459