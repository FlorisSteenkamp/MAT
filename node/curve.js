"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_memoize_1 = require("flo-memoize");
const flo_bezier3_1 = require("flo-bezier3");
const flo_vector2d_1 = require("flo-vector2d");
const corner_1 = require("./corner");
/**
 * Represents a bezier curve on the shape boundary / loop.
 */
class Curve {
    /**
     * Primarily for internal use.
     * @param loop The closed loop of bezier curves representing the shape
     * boundary this curve belongs to.
     * @param ps The bezier control points.
     * @param prev The previous curve (when going in a negative direction around
     * the shape boundary, i.e. clockwise for the outer shape and anti-clockwise
     * for the holes (if any)).
     * @param next The next curve (when going in a positive direction around
     * the shape boundary, i.e. anti-clockwise for the outer shape and clockwise
     * for the holes (if any)).
     * @param idx The curve's ordered index in the loop. This imposes a cycling
     * ordering of the curves in the loop.
     */
    constructor(loop, ps, prev, next, idx) {
        this.loop = loop;
        this.ps = ps;
        this.prev = prev;
        this.next = next;
        this.idx = idx;
    }
    /**
     * Returns information about the corner created at the end of this curve
     * (at t === 1) and the start of the next curve (at t === 0).
     * @param curve The relevant [[Curve]].
     */
    static getCornerAtEnd(curve) {
        return getCornerAtEnd(curve);
    }
}
exports.Curve = Curve;
/**
 * Angle in degrees to radians.
 * @private
 */
const DEGREES = {
    //'0'    : 0.0000,
    0.25: 0.0050,
    1: 0.0167,
    4: 0.0698,
    16: 0.2756,
};
/** @private */
const DEGREE_LIMIT = DEGREES[1];
/**
 * Returns information about the corner created at the end of this curve
 * (at t === 1) and the start of the next curve (at t === 0).
 * @private
 */
let getCornerAtEnd = flo_memoize_1.memoize(function (curve) {
    let tangents = [
        flo_bezier3_1.tangent(curve.ps, 1),
        flo_bezier3_1.tangent(curve.next.ps, 0)
    ];
    let crossTangents = flo_vector2d_1.cross(tangents[0], tangents[1]);
    return new corner_1.Corner(tangents, crossTangents, crossTangents < 0, crossTangents > 0, crossTangents < -DEGREE_LIMIT, crossTangents > +DEGREE_LIMIT);
});
//# sourceMappingURL=curve.js.map