import { distanceBetween, getObjClosestTo } from 'flo-vector2d';
import { Curve } from '../../curve.js';
import { createPos, PointOnShape } from '../../point-on-shape.js';
import { BezierPiece  } from '../bezier-piece.js';
import { cullBezierPieces } from './cull-bezier-pieces.js';
import { closestPointsOnCurve } from './closest-points-on-curve.js';
  

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
function getClosestBoundaryPointDd(
        bezierPieces: BezierPiece[], 
        point: number[], 
		touchedCurve: Curve, 
		t: number) {
	
	let bestDistance = Number.POSITIVE_INFINITY;
	let posInfo: { pos: PointOnShape; d: number };
	for (let i=0; i<bezierPieces.length; i++) {
		const bezierPiece = bezierPieces[i];

        const ps = closestPointsOnCurve(
            bezierPiece.curve, 
            point, 
            bezierPiece.ts, 
            touchedCurve, 
            t
        );

		const p = getObjClosestTo(point, ps, p => p.p)

		if (p === undefined) { continue; }

		const d = distanceBetween(p.p, point);

		let curve = bezierPiece.curve;
		let t_= p.t;

		if (d < bestDistance) {
			if (t_ === 0) {
				t_ = 1;
				curve = bezierPiece.curve.prev;
			}
			
			// posInfo = { pos: new PointOnShape(curve, t_), d };
			posInfo = {
				pos: createPos(curve, t_),
				d
			};
			bestDistance = d;
		}
	}

	return posInfo;
}


export { getClosestBoundaryPointDd };
