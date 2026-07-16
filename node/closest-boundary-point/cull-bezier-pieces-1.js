import { getBestDistanceSquared } from './get-best-distance-squared.js';
import { cullByLooseBoundingBox } from './cull-by-loose-bounding-box.js';
import { cullByTightBoundingBox } from './cull-by-tight-boundary-box.js';
/**
 * @param curvePieces
 * @param xO
 *
 * @internal
 */
function cullCurvePieces1(curvePieces, xO) {
    const bestSquaredDistance = getBestDistanceSquared(curvePieces, xO);
    curvePieces = cullByLooseBoundingBox(curvePieces, xO, bestSquaredDistance);
    curvePieces = cullByTightBoundingBox(curvePieces, xO, bestSquaredDistance);
    return curvePieces;
}
export { cullCurvePieces1 };
//# sourceMappingURL=cull-bezier-pieces-1.js.map