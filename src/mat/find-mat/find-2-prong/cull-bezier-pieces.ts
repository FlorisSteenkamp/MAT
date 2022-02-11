import { getClosestSquareDistanceToRect } from '../../geometry/get-closest-square-distance-to-rect.js';
import { BezierPiece } from '../../bezier-piece.js';
import { getBoundingBox_ } from '../../../get-bounding-box-.js';


/**
 * @hidden
 * Cull all bezierPieces not within given radius of a given point.
 * @param extreme
 * @param bezierPieces
 * @param p
 * @param rSquared
 */
function cullBezierPieces(
        bezierPieces: BezierPiece[], 
        p: number[], 
        rSquared: number) {

    const CULL_THRESHOLD = 5;
    // TODO - base delta on theory
    const TOLERANCE = 1+1e-3;

    if (bezierPieces.length <= CULL_THRESHOLD) {
        return bezierPieces;
    }


    let newPieces = [];
    for (let bezierPiece of bezierPieces) {
        let ps = bezierPiece.curve.ps;
        
        let rect = getBoundingBox_(ps);
        let bd = getClosestSquareDistanceToRect(rect, p);
        if (bd <= rSquared * TOLERANCE) {
            newPieces.push(bezierPiece);
        } 
    }

    return newPieces;
}


export { cullBezierPieces }
