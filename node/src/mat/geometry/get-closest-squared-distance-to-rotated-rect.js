"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
/**
 *
 */
function getClosestSquaredDistanceToRotatedRect(ps, p) {
    let ds = [0, 1, 2, 3].map(i => flo_vector2d_1.squaredDistanceBetweenPointAndLineSegment(p, [ps[i], ps[(i + 1) % 4]]));
    let width = flo_vector2d_1.squaredDistanceBetween(ps[0], ps[1]);
    let height = flo_vector2d_1.squaredDistanceBetween(ps[0], ps[3]);
    if (ds[0] <= height && ds[2] <= height &&
        ds[1] <= width && ds[3] <= width) {
        return 0; // Inside rotated rect
    }
    return Math.min(...ds);
}
exports.getClosestSquaredDistanceToRotatedRect = getClosestSquaredDistanceToRotatedRect;
