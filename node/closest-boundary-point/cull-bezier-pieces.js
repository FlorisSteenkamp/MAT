import { getBestDistanceSquared } from './get-best-distance-squared.js';
import { cullByLooseBoundingBox } from './cull-by-loose-bounding-box.js';
import { cullByTightBoundingBox } from './cull-by-tight-boundary-box.js';
/**
 * @internal
 * @param bezierPieces
 * @param p
 * @param extreme
 */
function cullBezierPieces1(bezierPieces, p) {
    const bestSquaredDistance = getBestDistanceSquared(bezierPieces, p);
    bezierPieces = cullByLooseBoundingBox(bezierPieces, p, bestSquaredDistance);
    bezierPieces = cullByTightBoundingBox(bezierPieces, p, bestSquaredDistance);
    return bezierPieces;
}
export { cullBezierPieces1 };
//# sourceMappingURL=cull-bezier-pieces.js.map