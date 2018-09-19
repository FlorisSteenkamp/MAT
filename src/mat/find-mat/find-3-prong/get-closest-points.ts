
import { PointOnShape } from '../../../point-on-shape';
import { BezierPiece  } from '../../../bezier-piece';

import { getClosestBoundaryPoint } from '../../get-closest-boundary-point';


/**
 * 
 * @param x 
 * @param bezierPiece3s 
 * @param extreme 
 */
function getClosestPoints(
        x: number[], 
        bezierPiece3s: BezierPiece[][]) {

    return bezierPiece3s.map(bezierPieces => {
        return getClosestBoundaryPoint(
                bezierPieces,
                x, 
                undefined, // curve
                undefined  // t
        );
    });
}


export { getClosestPoints }
