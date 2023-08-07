import { BezierPiece  } from '../mat/bezier-piece.js';
import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';
import { createPos } from '../point-on-shape/create-pos.js';


/**
 * @internal
 * @param x 
 * @param bezierPiece3s 
 * @param extreme 
 */
function getClosestPoints(
        x: number[], 
        bezierPiece3s: BezierPiece[][]) {

    return bezierPiece3s.map(bezierPieces => {
        return getCloseBoundaryPointsCertified(
            bezierPieces, x
        )[0];
    });
}


export { getClosestPoints }
