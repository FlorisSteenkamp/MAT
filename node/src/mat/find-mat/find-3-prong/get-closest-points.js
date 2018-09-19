"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_closest_boundary_point_1 = require("../../get-closest-boundary-point");
/**
 *
 * @param x
 * @param bezierPiece3s
 * @param extreme
 */
function getClosestPoints(x, bezierPiece3s) {
    return bezierPiece3s.map(bezierPieces => {
        return get_closest_boundary_point_1.getClosestBoundaryPoint(bezierPieces, x, undefined, // curve
        undefined // t
        );
    });
}
exports.getClosestPoints = getClosestPoints;
