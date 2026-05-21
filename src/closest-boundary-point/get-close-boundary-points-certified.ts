import { CurvePiece  } from '../mat/curve-piece.js';
import { getPotentialClosestPointsOnCurveCertified } from './get-potential-closest-points-on-curve-certified.js';
import { cullCurvePieces1 } from './cull-bezier-pieces.js';
import { Curve } from '../curve/curve.js';
import { FootAndEndpointInfo } from './foot-and-endpoint-info.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { createPos } from '../point-on-shape/create-pos.js';


/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given 
 * bezier pieces, including the beziers actually checked after culling.
 * 
 * @param pow
 * @param curvePieces
 * @param x
 * @param touchedCurve
 * @param t
 * @param for1Prong defaults to `false`;
 * @param angle defaults to `0`
 */
function getCloseBoundaryPointsCertified(
		pow: number,
        curvePieces: CurvePiece[], 
        x: number[], 
		touchedCurve: Curve | undefined = undefined,
		t: number | undefined = undefined,
		for1Prong = false,
		angle = 0): PointOnShape[] {
	
	curvePieces = cullCurvePieces1(curvePieces, x);
 
	const pInfoss: FootAndEndpointInfo[] = [];
	for (let i=0; i<curvePieces.length; i++) {
		const curvePiece = curvePieces[i];

		const pInfos = getPotentialClosestPointsOnCurveCertified(
			pow,
			curvePiece.curve, 
			x, 
			curvePiece.ts, 
			touchedCurve, 
			t,
			for1Prong,
			angle
		);

		pInfoss.push(...pInfos);
	}

	/** the minimum max interval value */
	let minMax = Number.POSITIVE_INFINITY;
	for (let i=0; i<pInfoss.length; i++) {
		const diMax = pInfoss[i].dSquaredI[1];
		if (diMax < minMax) {
			minMax = diMax;
		}
	}

	const closestPointInfos: FootAndEndpointInfo[] = [];

	for (let i=0; i<pInfoss.length; i++) {
		const info = pInfoss[i];
		if (info.dSquaredI[0] <= minMax) {
			closestPointInfos.push(info);
		}
	}

	return closestPointInfos.map(info => createPos(info.curve, info.t, false));
}


export { getCloseBoundaryPointsCertified };
