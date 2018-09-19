"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const get_closest_boundary_point_to_point_1 = require("../get-closest-boundary-point-to-point");
/**
 * Finds an initial 3-prong circle center point from which to iterate.
 * The point must be within the shape.
 * @param delta3s - The three boundary pieces of which we need to find the three
 * 3-prong points.
 */
function calcInitial3ProngCenter(delta3s, bezierPiece3s) {
    // TODO - No need to calculate, we already have this info somewhere.
    let twoProngCircleCenter = flo_vector2d_1.mean([
        delta3s[0][0].item.pointOnShape.p,
        delta3s[2][1].item.pointOnShape.p
    ]);
    let point1 = get_closest_boundary_point_to_point_1.getClosestBoundaryPointToPoint(bezierPiece3s[1], twoProngCircleCenter, undefined, // bezierNode
    undefined // t
    );
    let meanPoints = [
        delta3s[0][0].item.pointOnShape.p,
        point1.p,
        delta3s[2][1].item.pointOnShape.p,
    ];
    return flo_vector2d_1.circumCenter(meanPoints);
}
exports.calcInitial3ProngCenter = calcInitial3ProngCenter;
