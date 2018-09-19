"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
/**
 *
 */
function closestSquaredDistanceToRotatedRect(ps, p) {
    let ds = [0, 1, 2, 3]
        .map(i => flo_vector2d_1.squaredDistanceBetweenPointAndLineSegment(p, [ps[i], ps[(i + 1) % 4]]));
    return Math.min(...ds);
}
exports.closestSquaredDistanceToRotatedRect = closestSquaredDistanceToRotatedRect;
