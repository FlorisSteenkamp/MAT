import { getObjClosestTo } from 'flo-vector2d';
import { Curve } from '../curve/curve.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { createPos } from '../point-on-shape/create-pos.js';
import { BezierPiece  } from '../mat/bezier-piece.js';
import { cullBezierPieces1 } from './cull-bezier-pieces.js';
import { getPotentialClosestPointsOnCurveCertified } from './get-potential-closest-points-on-curve-certified.js';
import { squaredDistanceBetweenDd } from '../find-2-prong/squared-distance-between-dd.js';


/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given 
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param x
 * @param touchedCurve
 * @param t
 * @param extreme
 */
function getClosestBoundaryPointCertified(
		angle: number,
        bezierPieces: BezierPiece[], 
        x: number[], 
		touchedCurve: Curve, 
		t: number,
		for1Prong: boolean) {
	
	bezierPieces = cullBezierPieces1(bezierPieces, x);
 
	let bestDistance = Number.POSITIVE_INFINITY;
	let pos: PointOnShape;
	for (let i=0; i<bezierPieces.length; i++) {
		const bezierPiece = bezierPieces[i];

        const ps = getPotentialClosestPointsOnCurveCertified(
            bezierPiece.curve, 
            x, 
            bezierPiece.ts, 
            touchedCurve, 
            t,
			for1Prong,
			angle
        );

		const p = getObjClosestTo(x, ps, p => p.p)

		if (p === undefined) { continue; }

		const d = squaredDistanceBetweenDd(p.p, x);

		let curve = bezierPiece.curve;
		let t_= p.t;

		if (d < bestDistance) {
			if (t_ === 0) {
				t_ = 1;
				curve = bezierPiece.curve.prev;
			}
			
			pos = createPos(curve, t_, false);
			bestDistance = d;
		}
	}

	return pos!;
}


export { getClosestBoundaryPointCertified };
