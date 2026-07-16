import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect.js';
import { getBoundingBox$ } from '../geometry/get-bounding-box-.js';
import { memoize } from 'flo-memoize';
import { getBoundingBoxTight } from 'flo-bezier3';
import { getClosestSquaredDistanceToRotatedRect } from '../geometry/get-closest-squared-distance-to-rotated-rect.js';
const TOLERANCE = 1 + 2 ** -20;
const getBoundingBoxTight$ = memoize(getBoundingBoxTight);
/**
 * Cull all `curvePieces` not within the given radius of a given point.
 *
 * @param extreme
 * @param curvePieces
 * @param xO
 * @param xy2
 *
 * @internal
 */
function cullCurvePieces(curvePieces, xO, xy2) {
    if (curvePieces.length <= 2) {
        // Curve pieces can never be less than 2 at this stage since a curve
        // endpoint will be shared between 2 curves
        return curvePieces;
    }
    let lastIdx = 0;
    for (let i = 0; i < curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const { ps } = curvePiece.curve;
        const rect = getBoundingBox$(ps);
        const d = getClosestSquareDistanceToRect(rect, xO);
        if (d <= TOLERANCE * xy2) {
            const tightBoundingBox = getBoundingBoxTight$(ps);
            const d2 = getClosestSquaredDistanceToRotatedRect(tightBoundingBox, xO);
            if (d2 <= TOLERANCE * xy2) {
                curvePieces[lastIdx] = curvePiece;
                lastIdx++;
            }
        }
    }
    curvePieces.length = lastIdx;
    return curvePieces;
}
export { cullCurvePieces };
//# sourceMappingURL=cull-bezier-pieces.js.map