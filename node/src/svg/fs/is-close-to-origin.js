"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const DELTA = 1e-6;
/**
 * Returns true if the given point is close to the origin (by Manhattan
 * distance), fale otherwise.
 * @private
 * @param p - a point
 * @param delta - a tolerance - defaults to 1e-6;
 */
function isCloseToOrigin(p, delta = DELTA) {
    return flo_vector2d_1.manhattanLength(p) < delta;
}
exports.isCloseToOrigin = isCloseToOrigin;
