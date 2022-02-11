import { getBoundingBoxTight } from "flo-bezier3";
import { memoize } from "flo-memoize";
import { getClosestSquaredDistanceToRotatedRect } from '../geometry/get-closest-squared-distance-to-rotated-rect.js';
const getBoundingBoxTight_ = memoize(getBoundingBoxTight);
/**
 * @hidden
 * When checking distances, ignore all those with closest possible distance
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param bezierPieces
 * @param p
 * @param bestSquaredDistance
 */
function cullByTightBoundingBox(bezierPieces, p, bestSquaredDistance) {
    let candidateBezierPieces = [];
    for (let i = 0; i < bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        let ps = bezierPiece.curve.ps;
        let tightBoundingBox = getBoundingBoxTight_(ps);
        let d = getClosestSquaredDistanceToRotatedRect(tightBoundingBox, p);
        if (d <= bestSquaredDistance) {
            candidateBezierPieces.push(bezierPiece);
        }
    }
    return candidateBezierPieces;
}
export { cullByTightBoundingBox };
//# sourceMappingURL=cull-by-tight-boundary-box.js.map