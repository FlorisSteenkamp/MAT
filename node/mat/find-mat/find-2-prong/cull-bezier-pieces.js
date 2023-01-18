import { getClosestSquareDistanceToRect } from '../../geometry/get-closest-square-distance-to-rect.js';
import { getBoundingBox_ } from '../../../get-bounding-box-.js';
/**
 * @hidden
 * Cull all bezierPieces not within given radius of a given point.
 * @param extreme
 * @param bezierPieces
 * @param p
 * @param rSquared
 */
function cullBezierPieces(bezierPieces, p, rSquared) {
    const CULL_THRESHOLD = 5;
    // TODO - base delta on theory
    const TOLERANCE = 1 + 1e-3;
    if (bezierPieces.length <= CULL_THRESHOLD) {
        return bezierPieces;
    }
    const newPieces = [];
    for (const bezierPiece of bezierPieces) {
        const ps = bezierPiece.curve.ps;
        const rect = getBoundingBox_(ps);
        const bd = getClosestSquareDistanceToRect(rect, p);
        if (bd <= rSquared * TOLERANCE) {
            newPieces.push(bezierPiece);
        }
    }
    return newPieces;
}
export { cullBezierPieces };
//# sourceMappingURL=cull-bezier-pieces.js.map