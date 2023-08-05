import { BezierPiece  } from '../mat/bezier-piece.js';
import { getClosestBoundaryPointCertified } from '../closest-boundary-point/get-closest-boundary-point-certified.js';


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
        const pos = getClosestBoundaryPointCertified(
            0,
            bezierPieces,
            x, 
            undefined!, // curve
            undefined!  // t
        );

        return pos ? pos : undefined;
    });
}


export { getClosestPoints }
