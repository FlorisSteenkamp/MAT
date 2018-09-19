"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bezier3 = require("flo-bezier3");
const flo_memoize_1 = require("flo-memoize");
const Vector = require("flo-vector2d");
const get_loop_bounds_1 = require("./get-loop-bounds");
let { m1: memoize } = flo_memoize_1.default;
/**
 * Returns true if the given beizer loop is positively orientated, false
 * otherwise. Careful! Checks leftmost part of loop so twisted complex paths
 * may give an ambiguous orientation.
 */
let isPathPositivelyOrientated = memoize(function (bezierLoop) {
    let extreme = get_loop_bounds_1.getLoopBounds(bezierLoop).minX;
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
    let tan = Bezier3.tangent(ps)(t);
    if (t !== 1) {
        // Not a sharp corner
        return tan[1] < 0;
    }
    let psNext = curve.next.ps;
    let tanNext = Bezier3.tangent(psNext)(0);
    if (tan[1] * tanNext[1] > 0) {
        // Both tangents points up or both points down.
        return tan[1] < 0;
    }
    // One tangent points up and the other down.
    let c = Vector.cross(tan, tanNext);
    return c > 0;
    // We don't check for the very special case where the cross === 0. 
});
exports.isPathPositivelyOrientated = isPathPositivelyOrientated;
