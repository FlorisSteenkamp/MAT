import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect.js';
import { CurvePiece } from '../mat/curve-piece.js';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';


/**
 * @internal
 * Cull all bezierPieces not within given radius of a given point.
 * @param extreme
 * @param bezierPieces
 * @param p
 * @param rSquared
 */
function cullBezierPieces2(
        bezierPieces: CurvePiece[], 
        p: number[], 
        rSquared: number) {

    const TOLERANCE = 1 + 2**-10;

    if (bezierPieces.length <= 1) {
        return bezierPieces;
    }


    const newPieces = [];
    for (const bezierPiece of bezierPieces) {
        const ps = bezierPiece.curve.ps;
        
        const rect = getBoundingBox$(ps);
        const bd = getClosestSquareDistanceToRect(rect, p);
        if (bd <= TOLERANCE*rSquared) {
            newPieces.push(bezierPiece);
        } 
    }

    return newPieces;
}


export { cullBezierPieces2 }
