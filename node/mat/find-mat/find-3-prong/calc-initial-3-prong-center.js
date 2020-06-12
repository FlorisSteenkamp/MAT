"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcInitial3ProngCenter = void 0;
const flo_vector2d_1 = require("flo-vector2d");
const get_closest_boundary_point_1 = require("../../closest-boundary-point/get-closest-boundary-point");
/**
 * @hidden
 * Finds an initial 3-prong circle center point from which to iterate. The point
 * must be within the shape.
 * @param δ3s - The three boundary pieces of which we need to find the three
 * 3-prong points.
 * @param bezierPiece3s
 * @param extreme
 */
function calcInitial3ProngCenter(δ3s, bezierPiece3s) {
    let twoProngCircleCenter = δ3s[0][0].cp.circle.center;
    let posInfo = get_closest_boundary_point_1.getClosestBoundaryPoint(bezierPiece3s[1], twoProngCircleCenter, undefined, // curve
    undefined // t
    );
    let meanPoints = [
        δ3s[0][0].cp.pointOnShape.p,
        posInfo.pos.p,
        δ3s[2][1].cp.pointOnShape.p,
    ];
    return flo_vector2d_1.circumCenter(meanPoints);
}
exports.calcInitial3ProngCenter = calcInitial3ProngCenter;
//# sourceMappingURL=calc-initial-3-prong-center.js.map