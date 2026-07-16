import { getBoundingBoxTight } from "flo-bezier3";
import { memoize } from "flo-memoize";
import { getClosestSquaredDistanceToRotatedRect } from '../geometry/get-closest-squared-distance-to-rotated-rect.js';
const getBoundingBoxTight$ = memoize(getBoundingBoxTight);
/**
 * @internal
 * When checking distances, ignore all those with closest possible distance
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param curvePieces
 * @param p
 * @param bestSquaredDistance
 */
function cullByTightBoundingBox(curvePieces, p, bestSquaredDistance) {
    const candidateCurvePieces = [];
    for (let i = 0; i < curvePieces.length; i++) {
        const curvePiece = curvePieces[i];
        const ps = curvePiece.curve.ps;
        const tightBoundingBox = getBoundingBoxTight$(ps);
        const d = getClosestSquaredDistanceToRotatedRect(tightBoundingBox, p);
        if (d <= bestSquaredDistance) {
            candidateCurvePieces.push(curvePiece);
        }
    }
    return candidateCurvePieces;
}
export { cullByTightBoundingBox };
//# sourceMappingURL=cull-by-tight-boundary-box.js.map