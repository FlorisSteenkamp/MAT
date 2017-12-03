"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PathCurve {
    /**
     * An indexed cubic bezier curve.
     * @param indx
     * @param bezier3
     */
    constructor(indx, bezier3) {
        this.indx = indx;
        this.bezier3 = bezier3;
    }
}
/**
 * Returns the reverse of the given bezier and assign the new given idx.
 * @param {PathCurve} curve - a path curve
 * @param {number} idx
 * @returns {Bezier3}
 */
PathCurve.reverse = function (curve, newIndx) {
    let ps = curve.bezier3.slice().reverse();
    return new PathCurve(newIndx, ps);
};
exports.default = PathCurve;
