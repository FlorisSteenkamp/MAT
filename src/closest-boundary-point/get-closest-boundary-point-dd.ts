import { distanceBetween, getObjClosestTo } from 'flo-vector2d';
import { Curve } from '../curve/curve.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { createPos } from '../point-on-shape/create-pos.js';
import { BezierPiece  } from '../mat/bezier-piece.js';
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
	let poss: PointOnShape;
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
			
			poss = createPos(curve, t_, false);
			bestDistance = d;
		}
	}

	return poss!;
}


export { getClosestBoundaryPointDd };
