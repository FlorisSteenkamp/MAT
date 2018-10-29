"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_closest_boundary_point_1 = require("../../closest-boundary-point/get-closest-boundary-point");
/**
 *
 * @param x
 * @param bezierPiece3s
 * @param extreme
 */
function getClosestPoints(x, bezierPiece3s) {
    return bezierPiece3s.map(bezierPieces => {
        let posInfo = get_closest_boundary_point_1.getClosestBoundaryPoint(bezierPieces, x, undefined, // curve
        undefined // t
        );
        return posInfo ? posInfo.pos : undefined;
    });
}
exports.getClosestPoints = getClosestPoints;
//# sourceMappingURL=get-closest-points.js.map