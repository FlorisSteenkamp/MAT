"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const DELTA = 1e-6;
/**
 * Returns true if distance between consecutive points are all less than
 * some delta, false otherwise.
 * @hidden
 * @param ps - an array of points
 * @param delta - a tolerance - defaults to 1e-6;
 */
function isAlmostZeroLength(ps, delta = DELTA) {
    for (let i = 1; i < ps.length; i++) {
        let p1 = ps[i - 1];
        let p2 = ps[i];
        if (flo_vector2d_1.manhattanDistanceBetween(p1, p2) > delta) {
            return false;
        }
    }
    return true;
}
exports.isAlmostZeroLength = isAlmostZeroLength;
//# sourceMappingURL=is-almost-zero-length.js.map