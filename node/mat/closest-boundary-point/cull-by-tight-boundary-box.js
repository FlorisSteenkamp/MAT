"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cullByTightBoundingBox = void 0;
const flo_bezier3_1 = require("flo-bezier3");
const get_closest_squared_distance_to_rotated_rect_1 = require("../geometry/get-closest-squared-distance-to-rotated-rect");
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
        let tightBoundingBox = flo_bezier3_1.getBoundingBoxTight(ps);
        let d = get_closest_squared_distance_to_rotated_rect_1.getClosestSquaredDistanceToRotatedRect(tightBoundingBox, p);
        if (d <= bestSquaredDistance) {
            candidateBezierPieces.push(bezierPiece);
        }
    }
    return candidateBezierPieces;
}
exports.cullByTightBoundingBox = cullByTightBoundingBox;
//# sourceMappingURL=cull-by-tight-boundary-box.js.map