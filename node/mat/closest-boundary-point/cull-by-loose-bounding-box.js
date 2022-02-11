import { getBoundingBox_ } from '../../get-bounding-box-.js';
import { getClosestSquareDistanceToRect } from '../geometry/get-closest-square-distance-to-rect.js';
/**
 * @hidden
 * When checking distances, ignore all those with closest possible distance
 * further than 'bestSquaredDistance', i.e. cull them.
 * @param bezierPieces
 * @param p
 * @param dSquared
 */
function cullByLooseBoundingBox(bezierPieces, p, dSquared) {
    let candidateBezierPieces = [];
    for (let i = 0; i < bezierPieces.length; i++) {
        let bezierPiece = bezierPieces[i];
        let ps = bezierPiece.curve.ps;
        let boundingBox = getBoundingBox_(ps);
        let d = getClosestSquareDistanceToRect(boundingBox, p);
        if (d <= dSquared) {
            candidateBezierPieces.push(bezierPiece);
        }
    }
    return candidateBezierPieces;
}
export { cullByLooseBoundingBox };
//# sourceMappingURL=cull-by-loose-bounding-box.js.map