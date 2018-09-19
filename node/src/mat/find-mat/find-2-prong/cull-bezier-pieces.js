"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const get_closest_square_distance_to_rect_1 = require("../../geometry/get-closest-square-distance-to-rect");
/**
 * Cull all bezierPieces not within given radius of a given point.
 * @param extreme
 * @param bezierPieces
 * @param p
 * @param rSquared
 */
function cullBezierPieces(bezierPieces, p, rSquared) {
    const CULL_THRESHOLD = 5;
    const TOLERANCE = 1 + 1e-3;
    if (bezierPieces.length <= CULL_THRESHOLD) {
        return bezierPieces;
    }
    let newPieces = [];
    for (let bezierPiece of bezierPieces) {
        let ps = bezierPiece.curve.ps;
        let rect = flo_bezier3_1.getBoundingBox(ps);
        let bd = get_closest_square_distance_to_rect_1.getClosestSquareDistanceToRect(rect, p);
        if (bd <= rSquared * TOLERANCE) {
            newPieces.push(bezierPiece);
        }
    }
    return newPieces;
}
exports.cullBezierPieces = cullBezierPieces;
