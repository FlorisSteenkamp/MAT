import { CurvePiece  } from '../mat/curve-piece.js';
import { getCloseBoundaryPointsCertified } from '../closest-boundary-point/get-close-boundary-points-certified.js';


/**
 * @internal
 * @param x 
 * @param bezierPiece3s 
 * @param extreme 
 */
function getClosestPoints(
        x: number[], 
        bezierPiece3s: CurvePiece[][]) {

    return bezierPiece3s.map(bezierPieces => {
        return getCloseBoundaryPointsCertified(
            5,  // TODO - see find-2-prong
            bezierPieces, x
        )[0];
    });
}


export { getClosestPoints }
