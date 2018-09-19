"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const flo_memoize_1 = require("flo-memoize");
const flo_bezier3_1 = require("flo-bezier3");
const curve_1 = require("./curve");
const circle_1 = require("./circle");
let memoize = flo_memoize_1.default.m1;
class PointOnShape {
    /**
     * @param curve
     * @param t - The bezier parameter value
     */
    constructor(curve, t) {
        // Cache
        this.p_ = undefined;
        this.curve = curve;
        this.t = t;
    }
    get p() {
        return this.p_ === undefined
            ? this.p_ = flo_bezier3_1.evaluate(this.curve.ps, this.t)
            : this.p_;
    }
    static getOsculatingCircle(maxOsculatingCircleRadius, pos) {
        if (PointOnShape.isSharpCorner(pos)) {
            return new circle_1.Circle(pos.p, 0);
        }
        let radius = PointOnShape.calcOsculatingCircleRadius(pos);
        if (radius < 0) {
            radius = Number.POSITIVE_INFINITY;
        }
        radius = Math.min(radius, maxOsculatingCircleRadius);
        let ps = pos.curve.ps;
        let t = pos.t;
        let normal_ = flo_bezier3_1.normal(ps, t);
        let p = flo_bezier3_1.evaluate(ps, t);
        let circleCenter = [
            p[0] + normal_[0] * radius,
            p[1] + normal_[1] * radius
        ];
        return new circle_1.Circle(circleCenter, radius);
    }
    /**
     * Calculates the order (to distinguish between points lying on top of each
     * other) of the contact point if it is a dull corner.
     * @param pos
     */
    static calcOrder(circle, pos) {
        if (!PointOnShape.isDullCorner(pos)) {
            return 0;
        }
        //let corner = Curve.getCornerAtEnd(pos.curve);
        let corner = PointOnShape.getCorner(pos);
        let n = flo_vector2d_1.rotateNeg90Degrees(corner.tans[0]);
        let v = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(pos.p, circle.center));
        /*
        console.log('------------------------------');
        console.log('circle.center: ', circle.center);
        console.log('pos.p: ', pos.p);
        console.log('corner: ', corner);
        console.log('tans[0]: ', corner.tans[0]);
        console.log('n: ', n);
        console.log('v: ', v);
        console.log('-dot(n, v): ', -dot(n, v));
        */
        return -flo_vector2d_1.dot(n, v);
    }
}
/**
 * Calculates the osculating circle of the bezier at a
 * specific t. If it is found to have negative or nearly zero radius
 * it is clipped to have positive radius so it can point into the shape.
 * @param ps
 * @param t
 */
PointOnShape.calcOsculatingCircleRadius = memoize(function (pos) {
    let ps = pos.curve.ps;
    let t = pos.t;
    let κ = -flo_bezier3_1.κ(ps, t);
    // κ > 0 => bending inwards
    return 1 / κ;
});
PointOnShape.compare = function (a, b) {
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
};
/**
 * Ignores order2 (used in hole-closing two-prongs only)
 */
PointOnShape.compareInclOrder = function (a, b, aOrder, bOrder) {
    let res = PointOnShape.compare(a, b);
    if (res === undefined) {
        return undefined;
    }
    if (res !== 0) {
        return res;
    }
    res = aOrder - bOrder;
    //if (res !== 0) { return res; }
    //return a.order2 - b.order2;
    return res;
};
PointOnShape.getCorner = memoize(function (pos) {
    if (pos.t !== 0 && pos.t !== 1) {
        return undefined;
    }
    return curve_1.Curve.getCornerAtEnd(pos.t === 1 ? pos.curve : pos.curve.prev);
});
PointOnShape.isSharpCorner = memoize(function (pos) {
    let corner = PointOnShape.getCorner(pos);
    return corner && corner.isSharp;
});
PointOnShape.isDullCorner = memoize(function (pos) {
    let corner = PointOnShape.getCorner(pos);
    return corner && corner.isDull;
});
PointOnShape.isQuiteSharpCorner = memoize(function (pos) {
    let corner = PointOnShape.getCorner(pos);
    return corner && corner.isQuiteSharp;
});
PointOnShape.isQuiteDullCorner = memoize(function (pos) {
    let corner = PointOnShape.getCorner(pos);
    return corner && corner.isQuiteDull;
});
/**
 * Returns a human-readable string of the given PointOnShape.
 * For debugging only.
 */
PointOnShape.toHumanString = function (pos) {
    return '' + pos.p[0] + ', ' + pos.p[1] +
        ' | bz: ' + pos.curve.idx +
        ' | t: ' + pos.t;
};
exports.PointOnShape = PointOnShape;
