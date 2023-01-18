import { distanceBetween } from 'flo-vector2d';
import { IPointOnShape, PointOnShape } from '../../point-on-shape.js';
import { BezierPiece  } from '../bezier-piece.js';
import { cullBezierPieces } from './cull-bezier-pieces.js';
import { closestPointsOnCurve } from './closest-points-on-curve.js';
  

/**
 * @hidden
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
		y: IPointOnShape,
		distance: number) {
	
	const touchedCurve = y.curve;
	const t = y.t;
	const p_ = y.p;

	bezierPieces = cullBezierPieces(bezierPieces, point);
 
	// TODO - integrate with is-another-cp-closeby - we MUST check angle too!
	const DISTANCE_TOLERANCE = 1e-9;
	const posInfos: { pos: IPointOnShape; d: number }[] = [];
	for (let i=0; i<bezierPieces.length; i++) {
		const bezierPiece = bezierPieces[i];

		// TOOD - important - should be able to return multiple points
		const ps = closestPointsOnCurve(
				bezierPiece.curve, 
				point, 
				bezierPiece.ts, 
				touchedCurve, 
				t
		);

		//if (ps === undefined) { continue; }

		for (let j=0; j<ps.length; j++) {
			const p = ps[j];
			const d = distanceBetween(p.p, point);

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
		const indexesToCheck: number[] = [];
		for (let i=0; i<posInfos.length; i++) {
			const pi = posInfos[i];
			// Only check if they are close to the edges. Why??
			//if (pi.pos.t < 1e-2 || 1-pi.pos.t < 1e-2) {
				indexesToCheck.push(i);
			//}
		}
		const indexesToRemove: number[] = [];
		for (let i=0; i<indexesToCheck.length; i++) {
			for (let j=i+1; j<indexesToCheck.length; j++) {
				if (i === j) { continue; }
				const p1 = posInfos[indexesToCheck[i]].pos.p;
				const p2 = posInfos[indexesToCheck[j]].pos.p;
				// Below checks for source point too - similar to 
				// isAnotherCpCloseBy
				const p3 = p_;
				if ((Math.abs(p1[0] - p2[0]) < 1e-6 && 
					 Math.abs(p1[1] - p2[1]) < 1e-6) ||
					
					 (Math.abs(p1[0] - p3[0]) < 1e-6 && 
					  Math.abs(p1[1] - p3[1]) < 1e-6)
					) {

					indexesToRemove.push(indexesToCheck[i]);
				}
			}
		}
		for (let i=indexesToRemove.length -1; i >= 0; i--) {
		   posInfos.splice(indexesToRemove[i], 1);
		}
	}

	return posInfos;
}


export { getCloseBoundaryPoints };
