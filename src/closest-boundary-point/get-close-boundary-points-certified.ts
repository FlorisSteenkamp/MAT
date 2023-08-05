import { distanceBetween } from 'flo-vector2d';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { createPos } from '../point-on-shape/create-pos.js';
import { BezierPiece  } from '../mat/bezier-piece.js';
import { closestPointsOnCurveCertified } from './closest-points-on-curve-certified.js';
  

/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given 
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param point
 * @param touchedCurve
 * @param t
 * @param extreme
 */
// TODO - improve now that it is certified
function getCloseBoundaryPointsCertified(
		angle: number,
        bezierPieces: BezierPiece[], 
        point: number[], 
		y: PointOnShape,
		distance: number,
		extreme: number) {
	
	const touchedCurve = y.curve;
	const t = y.t;
	const p_ = y.p;

	// bezierPieces = cullBezierPieces(bezierPieces, point);
 
	// TODO - integrate with is-another-cp-closeby - we MUST check angle too!
	const DISTANCE_TOLERANCE = 2**-40*extreme;
	const poss: PointOnShape[] = [];
	for (let i=0; i<bezierPieces.length; i++) {
		const bezierPiece = bezierPieces[i];

		const ps = closestPointsOnCurveCertified(
			angle,
			bezierPiece.curve, 
			point, 
			bezierPiece.ts, 
			touchedCurve, 
			t
		);

		for (let j=0; j<ps.length; j++) {
			const p = ps[j];
			const d = distanceBetween(p.p, point);

			let curve = bezierPiece.curve;
			let t_= p.t;
	
			if (Math.abs(d - distance) < DISTANCE_TOLERANCE) {
				if (t_ === 0) {
					t_ = 1;
					curve = bezierPiece.curve.prev;
				}
				
				poss.push(createPos(curve, t_, false));
			}
		}
	}

	if (poss.length > 1) {
		// Remove ones that are too close together.
		const indexesToCheck: number[] = [];
		for (let i=0; i<poss.length; i++) {
			indexesToCheck.push(i);
		}
		const indexesToRemove: number[] = [];
		for (let i=0; i<indexesToCheck.length; i++) {
			for (let j=i + 1; j<indexesToCheck.length; j++) {
				if (i === j) { continue; }
				const p1 = poss[indexesToCheck[i]].p;
				const p2 = poss[indexesToCheck[j]].p;
				// Below checks for source point too - similar to 
				// isAnotherCpCloseBy
				const p3 = p_;
				if ((Math.abs(p1[0] - p2[0]) < 2**-30*extreme && 
					 Math.abs(p1[1] - p2[1]) < 2**-30*extreme) ||
					
					 (Math.abs(p1[0] - p3[0]) < 2**-30*extreme && 
					  Math.abs(p1[1] - p3[1]) < 2**-30*extreme)
					) {

					indexesToRemove.push(indexesToCheck[i]);
				}
			}
		}
		for (let i=indexesToRemove.length -1; i >= 0; i--) {
		   poss.splice(indexesToRemove[i], 1);
		}
	}

	return poss;
}


export { getCloseBoundaryPointsCertified };
