"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const flo_vector2d_1 = require("flo-vector2d");
const flo_memoize_1 = require("flo-memoize");
const flo_bezier3_1 = require("flo-bezier3");
const circle_1 = require("./circle");
let memoize = flo_memoize_1.default.m1;
/**
 * @constructor
 *
 * @param bezierNode
 * @param t - The bezier parameter value
 * @param type {MAT_CONSTANTS.pointType}
 *  'standard' : 0, // Not special,
 *  'sharp'    : 1, // Sharp corner,
 *  'dull'     : 2, // dull corner,
 * @param order - For dull corners only; equals the cross of the tangents at the
 * corner interface to impose an order on points with the same point coordinates
 * and t values.
 * @param circle - The osculating circle at this point pointing
 * towards the inside of the shape.
 */
class PointOnShape {
    constructor(bezierNode, t, type) {
        Object.assign(this, { bezierNode, t, type });
        //---- Cache
        this.p = flo_bezier3_1.evaluate(bezierNode.ps, t);
    }
    /**
     * Calculates the osculating circle of the bezier at a
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param ps
     * @param t
     */
    static calcOsculatingCircle(ps, t) {
        let κ = -flo_bezier3_1.κ(ps, t);
        // If (κ > 0) { Bending inwards. }
        let radius;
        if (κ <= 1 / mat_constants_1.MAT_CONSTANTS.maxOsculatingCircleRadius) {
            // Curving wrong way (or flat, or too big), but probably a 
            // significant point to put a 2-prong.
            radius = mat_constants_1.MAT_CONSTANTS.maxOsculatingCircleRadius;
        }
        else {
            radius = Math.min(1 / κ, mat_constants_1.MAT_CONSTANTS.maxOsculatingCircleRadius);
        }
        let normal_ = flo_bezier3_1.normal(ps, t);
        let p = flo_bezier3_1.evaluate(ps, t);
        let circleCenter = [
            p[0] + normal_[0] * radius,
            p[1] + normal_[1] * radius
        ];
        return new circle_1.Circle(circleCenter, radius);
    }
    static dullCornerAt(pos) {
        if (pos.t !== 0 && pos.t !== 1) {
            return;
        }
        let curve = pos.bezierNode;
        if (pos.t === 0) {
            curve = curve.prev;
        }
        return curve.corner;
    }
    /**
     * Calculates the order (to distinguish between points lying on top of each
     * other) of the contact point if it is a dull corner.
     * @param pos
     */
    static calcOrder(circle, pos) {
        let dullCorner = PointOnShape.dullCornerAt(pos);
        if (!dullCorner) {
            return 0;
        }
        let p = pos.p;
        let n = flo_vector2d_1.rotateNeg90Degrees(dullCorner.tans[0]);
        let v = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(p, circle.center));
        return -flo_vector2d_1.dot(n, v);
    }
    /**
     * Returns the PointOnShape type as a human-readable string.
     * @param type
     */
    // TODO - remove - use enum
    static typeToStr(type) {
        for (let key in mat_constants_1.MAT_CONSTANTS.pointType) {
            if (mat_constants_1.MAT_CONSTANTS.pointType[key] === type) {
                return key;
            }
        }
    }
}
PointOnShape.getOsculatingCircle = memoize(function (pos) {
    if (pos.type === mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
        return new circle_1.Circle(pos.p, 0);
    }
    else if (pos.type === mat_constants_1.MAT_CONSTANTS.pointType.extreme) {
        let r = mat_constants_1.MAT_CONSTANTS.maxOsculatingCircleRadius;
        let p = [pos.p[0], pos.p[1] - r];
        return new circle_1.Circle(p, r);
    }
    return PointOnShape.calcOsculatingCircle(pos.bezierNode.ps, pos.t);
});
PointOnShape.compare = function (a, b) {
    if (a === undefined || b === undefined) {
        return undefined;
    }
    let res;
    res = a.bezierNode.idx - b.bezierNode.idx;
    if (res !== 0) {
        return res;
    }
    res = a.t - b.t;
    return res;
};
/**
* Returns true if its osculation circle is pointing straight upwards.
*/
PointOnShape.isPointingStraightUp = function (pos) {
    let circle = PointOnShape.getOsculatingCircle(pos);
    if (!circle) {
        return false;
    }
    let circleDirection = flo_vector2d_1.toUnitVector(flo_vector2d_1.fromTo(pos.p, circle.center));
    // If not almost pointing straight up
    if (Math.abs(circleDirection[0]) > 1e-6 ||
        circleDirection[1] > 0) {
        return false;
    }
    return true;
};
/**
 * Creates a string key that only depends on the PointOnShape's coordinates.
 */
PointOnShape.makeSimpleKey = function (p) {
    return '' + p[0] + ', ' + p[1];
};
/**
 * Returns a human-readable string of the PointOnShape.
 *
 * For debugging only.
 */
PointOnShape.toHumanString = function (pos) {
    return '' + pos.p[0] + ', ' + pos.p[1] +
        ' | bz: ' + pos.bezierNode.idx +
        ' | t: ' + pos.t +
        ' | ' + PointOnShape.typeToStr(pos.type); // TODO - use enum
};
exports.PointOnShape = PointOnShape;
