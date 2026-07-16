import type { CurvePiece  } from '../mat/curve-piece.js';
import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';


/**
 * @param maxCoordPowerOf2
 * @param x 
 * @param curvePiece3s 
 * 
 * @internal
 */
function getClosestPoints(
        maxCoordPowerOf2: number,
        x: number[], 
        curvePiece3s: CurvePiece[][]) {

    return curvePiece3s.map(curvePieces => {
        return getCloseBoundaryPointsCertified(
            maxCoordPowerOf2,
            curvePieces,
            x
        )[0];
    });
}


export { getClosestPoints }
