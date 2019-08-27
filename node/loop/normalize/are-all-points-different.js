"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns true if all points in the given array are different, false otherwise.
 * @param ps An array of points.
 */
function areAllPointsDifferent(ps) {
    for (let i = 0; i < ps.length - 1; i++) {
        for (let j = i + 1; j < ps.length; j++) {
            if (ps[i][0] === ps[j][0] && ps[i][1] === ps[j][1]) {
                return false;
            }
        }
    }
    return true;
}
exports.areAllPointsDifferent = areAllPointsDifferent;
//# sourceMappingURL=are-all-points-different.js.map