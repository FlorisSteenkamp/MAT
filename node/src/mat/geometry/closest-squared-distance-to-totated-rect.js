"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
/**
 *
 */
function closestSquaredDistanceToRotatedRect(ps, p) {
    let tightBoundingBox = ps;
    let ds = [0, 1, 2, 3].map(function (i) {
        return flo_vector2d_1.squaredDistanceBetweenPointAndLineSegment(p, [tightBoundingBox[i], tightBoundingBox[(i + 1) % 4]]);
    });
    return Math.min(...ds);
}
exports.closestSquaredDistanceToRotatedRect = closestSquaredDistanceToRotatedRect;
