import { dot, fromTo, toUnitVector, rotateNeg90Degrees } from 'flo-vector2d';
import { memoize } from 'flo-memoize';
import { curvature, evalDeCasteljau, tangent } from 'flo-bezier3';
import { getCornerAtEnd } from './curve.js';
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
            ? this.p_ = evalDeCasteljau(this.curve.ps, this.t)
            : this.p_;
    }
}
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
    return getCornerAtEnd(pos.t === 1 ? pos.curve : pos.curve.prev);
}
/**
 * @hidden
 */
let isPosSharpCorner = memoize((pos) => {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner(pos).isSharp;
});
/**
 * @hidden
 */
let isPosDullCorner = memoize((pos) => {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner(pos).isDull;
});
/**
 * @hidden
 */
let isPosQuiteSharpCorner = memoize((pos) => {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner(pos).isQuiteSharp;
});
/**
 * @hidden
 */
let isPosQuiteDullCorner = memoize((pos) => {
    if (!isPosCorner(pos)) {
        return false;
    }
    return getPosCorner(pos).isQuiteDull;
});
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
    let n = rotateNeg90Degrees(corner.tangents[0]);
    let v = toUnitVector(fromTo(pos.p, circle.center));
    return -dot(n, v);
}
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
/**
 * Calculates and returns the osculating circle radius of the bezier at a
 * specific t. If it is found to have negative or nearly zero radius
 * it is clipped to have positive radius so it can point into the shape.
 * @param ps
 * @param t
 * @hidden
 */
let calcOsculatingCircleRadius = memoize((pos) => {
    let ps = pos.curve.ps;
    let t = pos.t;
    let c = -curvature(ps, t);
    // c > 0 => bending inwards
    return 1 / c;
});
/**
 * Returns the osculating circle at this point of the curve.
 * @param maxOsculatingCircleRadius If not Number.POSITIVE_INFINITY then the
 * circle radius will be limited to this value.
 * @param pos The [[PointOnShape]] identifying the point.
 */
function getOsculatingCircle(maxOsculatingCircleRadius, pos) {
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
    const tangent_ = tangent(ps, t);
    let normal_ = toUnitVector([-tangent_[1], tangent_[0]]);
    let p = evalDeCasteljau(ps, t);
    let circleCenter = [
        p[0] - normal_[0] * radius,
        p[1] - normal_[1] * radius
    ];
    return { center: circleCenter, radius };
}
export { PointOnShape, getOsculatingCircle, comparePoss, calcPosOrder, posToHumanString, isPosSharpCorner, isPosDullCorner, isPosQuiteSharpCorner, isPosQuiteDullCorner };
//# sourceMappingURL=point-on-shape.js.map