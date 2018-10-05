"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_memoize_1 = require("flo-memoize");
const flo_bezier3_1 = require("flo-bezier3");
const flo_vector2d_1 = require("flo-vector2d");
let memoize = flo_memoize_1.default.m1;
class Curve {
    /**
     * Representation of a curve in a linked loop (of bezier curves).
     * @param loop The linked loop this node belongs to.
     * @param ps The bezier points.
     * @param prev The previous curve.
     * @param next The next curve.
     * @param idx The curve's ordered index in the loop.
     */
    constructor(loop, ps, prev, next, idx) {
        this.loop = loop;
        this.ps = ps;
        this.prev = prev;
        this.next = next;
        this.idx = idx;
    }
    static getCornerAtEnd(curve) {
        return getCornerAtEnd(curve);
    }
}
exports.Curve = Curve;
// Angle in degrees
const DEGREES = {
    //'0'    : 0.0000,
    0.25: 0.0050,
    1: 0.0167,
    4: 0.0698,
    16: 0.2756,
};
const DEGREE_LIMIT = DEGREES[1];
/**
 * Gets the cross of the unit tangents of the vector at the end of this
 * curve and the start of the next curve.
 */
let getCornerAtEnd = memoize(function (curve) {
    let tans = [
        flo_bezier3_1.tangent(curve.ps, 1),
        flo_bezier3_1.tangent(curve.next.ps, 0)
    ];
    let crossTangents = flo_vector2d_1.cross(tans[0], tans[1]);
    return {
        tans,
        crossTangents,
        isSharp: crossTangents < 0,
        isDull: crossTangents > 0,
        isQuiteSharp: crossTangents < -DEGREE_LIMIT,
        isQuiteDull: crossTangents > +DEGREE_LIMIT
    };
});
