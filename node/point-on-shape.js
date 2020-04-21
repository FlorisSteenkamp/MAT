"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const flo_memoize_1 = require("flo-memoize");
const flo_bezier3_1 = require("flo-bezier3");
const curve_1 = require("./curve");
/**
 * Represents a point on the shape boundary for which MAT vertex information
 * has not *necessarily* been calculated.
 */
class PointOnShape {
    /**
     * @param curve	The [[ICurve]] on the shape boundary this points belong to.
     * @param t The bezier parameter value on the curve to identify the point
     * coordinates.
     */
    constructor(curve, t) {
        this.curve = curve;
        this.t = t;
        // Cache
        this.p_ = undefined;
    }
    /**
     * The planar point coordinates of this [[PointOnShape]].
     */
    get p() {
        return this.p_ === undefined
            ? this.p_ = flo_bezier3_1.evalDeCasteljau(this.curve.ps, this.t)
            : this.p_;
    }
}
exports.PointOnShape = PointOnShape;
/**
 * @hidden
 */
function isPosCorner(pos) {
    return (pos.t === 0 || pos.t === 1);
}
/**
 * @hidden
 */
function getPosCorner(pos) {
    return curve_1.getCornerAtEnd(pos.t === 1 ? pos.curve : pos.curve.prev);
}
/**
 * @hidden
 */
let isPosSharpCorner = flo_memoize_1.memoize((pos) => {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner(pos).isSharp;
});
exports.isPosSharpCorner = isPosSharpCorner;
/**
 * @hidden
 */
let isPosDullCorner = flo_memoize_1.memoize((pos) => {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner(pos).isDull;
});
exports.isPosDullCorner = isPosDullCorner;
/**
 * @hidden
 */
let isPosQuiteSharpCorner = flo_memoize_1.memoize((pos) => {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner(pos).isQuiteSharp;
});
exports.isPosQuiteSharpCorner = isPosQuiteSharpCorner;
/**
 * @hidden
 */
let isPosQuiteDullCorner = flo_memoize_1.memoize((pos) => {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner(pos).isQuiteDull;
});
exports.isPosQuiteDullCorner = isPosQuiteDullCorner;
/**
 * Returns a human-readable string of the given [[PointOnShape]].
 * For debugging only.
 * @hidden
 */
function posToHumanString(pos) {
    return '' + pos.p[0] + ', ' + pos.p[1] +
        ' | bz: ' + pos.curve.idx +
        ' | t: ' + pos.t;
}
exports.posToHumanString = posToHumanString;
/**
 * @hidden
 * Calculates the order (to distinguish between points lying on top of each
 * other) of the contact point if it is a dull corner.
 * @param pos
 */
function calcPosOrder(circle, pos) {
    if (!isPosCorner(pos)) {
        return 0;
    }
    if (!isPosDullCorner(pos)) {
        return 0;
    }
    //if (!isPosDullCorner(pos)) { return 0; }
    let corner = getPosCorner(pos);
    let n = flo_vector2d_1.rotateNeg90Degrees(corner.tangents[0]);
    let v = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(pos.p, circle.center));
    return -flo_vector2d_1.dot(n, v);
}
exports.calcPosOrder = calcPosOrder;
/**
 * Compares two [[PointOnShape]]s according to their cyclic ordering imposed
 * by their relative positions on the shape boundary.
 * @param a The first [[PointOnShape]].
 * @param b The second [[PointOnShape]].
 * @hidden
 */
function comparePoss(a, b) {
    if (a === undefined || b === undefined) {
        return undefined;
    }
    let res;
    res = a.curve.idx - b.curve.idx;
    if (res !== 0) {
        return res;
    }
    res = a.t - b.t;
    return res;
}
exports.comparePoss = comparePoss;
/**
 * Calculates and returns the osculating circle radius of the bezier at a
 * specific t. If it is found to have negative or nearly zero radius
 * it is clipped to have positive radius so it can point into the shape.
 * @param ps
 * @param t
 * @hidden
 */
let calcOsculatingCircleRadius = flo_memoize_1.memoize((pos) => {
    let ps = pos.curve.ps;
    let t = pos.t;
    let κ = -flo_bezier3_1.κ(ps, t);
    // κ > 0 => bending inwards
    return 1 / κ;
});
/**
 * Returns the osculating circle at this point of the curve.
 * @param maxOsculatingCircleRadius If not Number.POSITIVE_INFINITY then the
 * circle radius will be limited to this value.
 * @param pos The [[PointOnShape]] identifying the point.
 */
function getOsculatingCircle(maxOsculatingCircleRadius, pos) {
    //if (PointOnShape.isSharpCorner(pos)) {
    if (isPosSharpCorner(pos)) {
        return { center: pos.p, radius: 0 };
    }
    let radius = calcOsculatingCircleRadius(pos);
    if (radius < 0) {
        radius = Number.POSITIVE_INFINITY;
    }
    radius = Math.min(radius, maxOsculatingCircleRadius);
    let ps = pos.curve.ps;
    let t = pos.t;
    let normal_ = flo_vector2d_1.toUnitVector(flo_bezier3_1.normal(ps, t));
    let p = flo_bezier3_1.evalDeCasteljau(ps, t);
    let circleCenter = [
        p[0] + normal_[0] * radius,
        p[1] + normal_[1] * radius
    ];
    return { center: circleCenter, radius };
}
exports.getOsculatingCircle = getOsculatingCircle;
//# sourceMappingURL=point-on-shape.js.map