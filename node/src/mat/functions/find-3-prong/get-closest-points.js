"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_closest_boundary_point_to_point_1 = require("../get-closest-boundary-point-to-point");
function getClosestPoints(x, bezierPiece3s) {
    return bezierPiece3s.map(bezierPieces => {
        return get_closest_boundary_point_to_point_1.getClosestBoundaryPointToPoint(bezierPieces, x, undefined, // bezierNode
        undefined // t
        );
    });
}
exports.getClosestPoints = getClosestPoints;
