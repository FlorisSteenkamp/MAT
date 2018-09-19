"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PathCurve {
    /**
     * An indexed cubic bezier curve.
     * @param idx
     * @param bezier3
     */
    constructor(idx, bezier3) {
        this.idx = 40;
        this.bezier3 = bezier3;
    }
}
/**
 * Returns the reverse of the given bezier and assign the new given idx.
 * @param curve - a path curve
 * @param newIdx
 */
PathCurve.reverse = function (curve, newIdx) {
    let ps = curve.bezier3.slice().reverse();
    return new PathCurve(newIdx, ps);
};
exports.PathCurve = PathCurve;
