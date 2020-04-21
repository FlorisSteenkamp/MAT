
import { distanceBetween, getObjClosestTo } from 'flo-vector2d';
import { Curve } from '../../curve';
import { PointOnShape, IPointOnShape } from '../../point-on-shape';
import { BezierPiece  } from '../bezier-piece';
import { cullBezierPieces } from './cull-bezier-pieces';
import { closestPointsOnCurve } from './closest-points-on-curve';
  

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
function getClosestBoundaryPoint(
        bezierPieces: BezierPiece[], 
        point: number[], 
		touchedCurve: Curve, 
		t: number) {
	
	bezierPieces = cullBezierPieces(bezierPieces, point);
 
	let bestDistance = Number.POSITIVE_INFINITY;
	let posInfo: { pos: IPointOnShape; d: number };
	for (let i=0; i<bezierPieces.length; i++) {
		let bezierPiece = bezierPieces[i];

		let ps = closestPointsOnCurve(
				bezierPiece.curve, 
				point, 
				bezierPiece.ts, 
				touchedCurve, 
				t
		);

		let p = getObjClosestTo(point, ps, p => p.p)

		if (p === undefined) { continue; }

		let d = distanceBetween(p.p, point);

		let curve = bezierPiece.curve;
		let t_= p.t;

		if (d < bestDistance) {
			if (t_ === 0) {
				t_ = 1;
				curve = bezierPiece.curve.prev;
			}
			
			posInfo = { pos: new PointOnShape(curve, t_), d };
			bestDistance = d;
		}
	}

	return posInfo;
}


export { getClosestBoundaryPoint };
