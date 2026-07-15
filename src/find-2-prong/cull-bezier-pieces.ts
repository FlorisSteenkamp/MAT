import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect.js';
import { CurvePiece } from '../mat/curve-piece.js';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';

const { sqrt } = Math;


// TODO - must improve this
/**
 * Cull all `curvePieces` not within the given radius of a given point.
 * 
 * @param extreme
 * @param curvePieces
 * @param p
 * @param rSquared
 * 
 * @internal
 */
function cullCurvePieces2(
        curvePieces: (CurvePiece | undefined)[], 
        p: number[], 
        rSquared: number): CurvePiece[] {

    const TOLERANCE = 1 + 2**-20;

    if (curvePieces.length <= 1) {
        return curvePieces as CurvePiece[];
    }

    const curvePieces_: CurvePiece[] = [];
    for (const curvePiece of curvePieces) {
        if (curvePiece === undefined) { continue; }

        const { ps } = curvePiece.curve;
        
        const rect = getBoundingBox$(ps);
        const bd = getClosestSquareDistanceToRect(rect, p);
        if (bd <= TOLERANCE*rSquared) {
            curvePieces_.push(curvePiece);
        } 
    }

    return curvePieces_;
}


export { cullCurvePieces2 }
