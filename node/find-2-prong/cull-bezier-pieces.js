import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect.js';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';
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
function cullCurvePieces2(curvePieces, p, rSquared) {
    const TOLERANCE = 1 + 2 ** -10;
    if (curvePieces.length <= 1) {
        return curvePieces;
    }
    const newPieces = [];
    for (const curvePiece of curvePieces) {
        const { ps } = curvePiece.curve;
        const rect = getBoundingBox$(ps);
        const bd = getClosestSquareDistanceToRect(rect, p);
        if (bd <= TOLERANCE * rSquared) {
            newPieces.push(curvePiece);
        }
    }
    return newPieces;
}
export { cullCurvePieces2 };
//# sourceMappingURL=cull-bezier-pieces.js.map