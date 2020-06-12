"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cullByLooseBoundingBox = void 0;
const flo_bezier3_1 = require("flo-bezier3");
const get_closest_square_distance_to_rect_1 = require("../geometry/get-closest-square-distance-to-rect");
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
        let boundingBox = flo_bezier3_1.getBoundingBox(ps);
        let d = get_closest_square_distance_to_rect_1.getClosestSquareDistanceToRect(boundingBox, p);
        if (d <= dSquared) {
            candidateBezierPieces.push(bezierPiece);
        }
    }
    return candidateBezierPieces;
}
exports.cullByLooseBoundingBox = cullByLooseBoundingBox;
//# sourceMappingURL=cull-by-loose-bounding-box.js.map