
import { PointOnShape } from '../../../point-on-shape';
import { BezierPiece  } from '../../../bezier-piece';

import { getClosestBoundaryPoint } from 
    '../../closest-boundary-point/get-closest-boundary-point';


/**
 * @hidden
 * @param x 
 * @param bezierPiece3s 
 * @param extreme 
 */
function getClosestPoints(
        x: number[], 
        bezierPiece3s: BezierPiece[][]) {

    return bezierPiece3s.map(bezierPieces => {
        let posInfo = getClosestBoundaryPoint(
                bezierPieces,
                x, 
                undefined, // curve
                undefined  // t
        );

        return posInfo ? posInfo.pos : undefined;
    });
}


export { getClosestPoints }
