"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
const flo_memoize_1 = require("flo-memoize");
const curve_1 = require("../../curve");
const get_loop_bounds_1 = require("./get-loop-bounds");
/**
 * Returns true if the given beizer loop is positively orientated, false
 * otherwise. Careful! Checks leftmost part of loop so twisted complex paths
 * may give an ambiguous orientation.
 */
let isPathPositivelyOrientated = flo_memoize_1.memoize(function (loop) {
    let extreme = get_loop_bounds_1.getLoopBounds(loop).minY;
    let t = extreme.t;
    let curve;
    if (t === 0) {
        curve = extreme.curve.prev;
        t = 1;
    }
    else {
        curve = extreme.curve;
    }
    let ps = curve.ps;
    let tan = flo_bezier3_1.tangent(ps)(t);
    if (t !== 1) {
        // Not a sharp corner
        return tan[0] > 0;
    }
    let psNext = curve.next.ps;
    let tanNext = flo_bezier3_1.tangent(psNext)(0);
    if (tan[0] * tanNext[0] > 0) {
        // Both tangents points left or both points right.
        return tan[0] > 0;
    }
    let corner = curve_1.getCorner(ps, psNext);
    return corner.isDull;
});
exports.isPathPositivelyOrientated = isPathPositivelyOrientated;
//# sourceMappingURL=is-path-positively-oriented.js.map