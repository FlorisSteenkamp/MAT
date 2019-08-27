
declare var _debug_: MatDebug;

import { MatDebug } from '../../debug/debug';

import { distanceBetween } from 'flo-vector2d';

import { Curve        } from '../../curve';
import { PointOnShape } from '../../point-on-shape';
import { BezierPiece  } from '../../bezier-piece';

import { cullBezierPieces } from './cull-bezier-pieces';
import { closestPointsOnCurve } from './closest-points-on-curve';
  

/**
 * Returns the closest boundary point to the given point, limited to the given 
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param point
 * @param touchedCurve
 * @param t
 * @param extreme
 */
function getCloseBoundaryPoints(
        bezierPieces: BezierPiece[], 
        point: number[], 
		y: PointOnShape, 
		distance: number) {
	
	let touchedCurve = y.curve;
	let t = y.t;
	let p_ = y.p;

	bezierPieces = cullBezierPieces(bezierPieces, point);
 
	// TODO - integrate with is-another-cp-closeby - we MUST check angle too!
	let DISTANCE_TOLERANCE = 1e-9;
	let posInfos: { pos: PointOnShape; d: number }[] = [];
	for (let i=0; i<bezierPieces.length; i++) {
		let bezierPiece = bezierPieces[i];

		// TOOD - important - should be able to return multiple points
		let ps = closestPointsOnCurve(
				bezierPiece.curve, 
				point, 
				bezierPiece.ts, 
				touchedCurve, 
				t,
				distance,
				DISTANCE_TOLERANCE
		);

		//if (ps === undefined) { continue; }

		for (let j=0; j<ps.length; j++) {
			let p = ps[j];
			let d = distanceBetween(p.p, point);

			let curve = bezierPiece.curve;
			let t_= p.t;
	
			if (Math.abs(d-distance) < DISTANCE_TOLERANCE) {
				if (t_ === 0) {
					t_ = 1;
					curve = bezierPiece.curve.prev;
				}
				
				posInfos.push({ pos: new PointOnShape(curve, t_), d });
			}
		}
	}

	if (posInfos.length > 1) {
		// Remove ones that are too close together.
		// TODO - in future remove all these checks and join n-prongs when they
		// are being added - much simpler and more symmetric. Remeber order when
		// comparing closeness!
		let indexesToCheck: number[] = [];
		for (let i=0; i<posInfos.length; i++) {
			let pi = posInfos[i];
			// Only check if they are close to the edges. Why??
			//if (pi.pos.t < 1e-2 || 1-pi.pos.t < 1e-2) {
				indexesToCheck.push(i);
			//}
		}
		let indexesToRemove: number[] = [];
		for (let i=0; i<indexesToCheck.length; i++) {
			for (let j=i+1; j<indexesToCheck.length; j++) {
				if (i === j) { continue; }
				let p1 = posInfos[indexesToCheck[i]].pos.p;
				let p2 = posInfos[indexesToCheck[j]].pos.p;
				// Below checks for source point too - similar to 
				// isAnotherCpCloseBy
				let p3 = p_;
				if ((Math.abs(p1[0] - p2[0]) < 1e-6 && 
					 Math.abs(p1[1] - p2[1]) < 1e-6) ||
					
					 (Math.abs(p1[0] - p3[0]) < 1e-6 && 
					  Math.abs(p1[1] - p3[1]) < 1e-6)
					) {

					//console.log(i);
					indexesToRemove.push(indexesToCheck[i]);
				}
			}
		}
		for (let i=indexesToRemove.length -1; i >= 0; i--) {
		   posInfos.splice(indexesToRemove[i], 1);
		}

		/*
		if (posInfos.length > 1) {
			console.log(p_);
			console.log(posInfos.map(pi => pi.d), posInfos.map(pi => pi.pos.p), posInfos.map(pi => pi.pos.t))
			console.log('-------');
		}*/
	}

	return posInfos;
}


export { getCloseBoundaryPoints };
