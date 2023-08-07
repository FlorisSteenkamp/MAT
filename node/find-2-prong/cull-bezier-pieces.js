import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect.js';
import { getBoundingBox_ } from '../geometry/get-bounding-box-.js';
/**
 * @internal
 * Cull all bezierPieces not within given radius of a given point.
 * @param extreme
 * @param bezierPieces
 * @param p
 * @param rSquared
 */
function cullBezierPieces2(bezierPieces, p, rSquared) {
    const TOLERANCE = 1 + 2 ** -10;
    if (bezierPieces.length <= 1) {
        return bezierPieces;
    }
    const newPieces = [];
    for (const bezierPiece of bezierPieces) {
        const ps = bezierPiece.curve.ps;
        const rect = getBoundingBox_(ps);
        const bd = getClosestSquareDistanceToRect(rect, p);
        if (bd <= TOLERANCE * rSquared) {
            newPieces.push(bezierPiece);
        }
    }
    return newPieces;
}
export { cullBezierPieces2 };
//# sourceMappingURL=cull-bezier-pieces.js.map