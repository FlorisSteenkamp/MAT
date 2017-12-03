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
 * @param order - For dull corners only; equals the cross of
 * 		  the tangents at the corner interface to impose an order on
 * 		  points with the same point coordinates and t values.
 * @param order2 - For points of hole closing 2-prongs only;
 *		  these points are duplicated to split the shape so they need
 *        to be ordered appropriately.
 * @param circle - The osculating circle at this point pointing
 * towards the inside of the shape.
 */
class PointOnShape {
    constructor(bezierNode, t, type, order, order2) {
        this.bezierNode = bezierNode;
        this.t = t;
        this.type = type;
        this.order = order;
        this.order2 = order2;
        //---- Cache
        let p = flo_bezier3_1.default.evaluate(bezierNode.item.bezier3, t);
        this.p = p;
        // Removing this cache will help in that if {PointOnShape} is 
        // called as a parameter (where a point is required) it will more 
        // likely result in monomorphic behaviour as opposed to polymorphic 
        // or megamorphic.
        this[0] = p[0];
        this[1] = p[1];
    }
    /**
     * Calculates the osculating circle of the bezier at a
     * specific t. If it is found to have negative or nearly zero radius
     * it is clipped to have positive radius so it can point into the shape.
     * @param pathCurve
     * @param t
     */
    static calcOsculatingCircle(pathCurve, t) {
        let ps = pathCurve.bezier3;
        let κ = -flo_bezier3_1.default.κ(ps, t);
        // If (κ > 0) { Bending inwards. }
        let radius;
        if (κ <= 1 / mat_constants_1.default.maxOsculatingCircleRadius) {
            // Curving wrong way (or flat, or too big), but probably a 
            // significant point to put a 2-prong.
            radius = mat_constants_1.default.maxOsculatingCircleRadius;
        }
        else {
            radius = Math.min(1 / κ, mat_constants_1.default.maxOsculatingCircleRadius);
        }
        let normal = flo_bezier3_1.default.normal(ps, t);
        let p = flo_bezier3_1.default.evaluate(ps, t);
        let circleCenter = [
            p[0] + normal[0] * radius,
            p[1] + normal[1] * radius
        ];
        return new circle_1.default(circleCenter, radius);
    }
    static dullCornerAt(shape, p) {
        let dullCornerHash = shape.dullCornerHash;
        let key = PointOnShape.makeSimpleKey(p);
        return dullCornerHash[key] || null;
    }
    /**
     * Clones the PointOnShape.
     */
    // TODO - rename to clone
    // TODO - deep clone?
    static copy(pos) {
        return new PointOnShape(pos.bezierNode, pos.t, pos.type, pos.order, pos.order2);
    }
    /**
     * Returns the PointOnShape type as a human-readable
     * string.
     * @param {number} type
     * @returns {string}
     */
    // TODO - remove - use enum
    static typeToStr(type) {
        for (let key in mat_constants_1.default.pointType) {
            if (mat_constants_1.default.pointType[key] === type) {
                return key;
            }
        }
    }
}
PointOnShape.getOsculatingCircle = memoize(function (pos) {
    if (pos.type === mat_constants_1.default.pointType.sharp) {
        return new circle_1.default(pos.p, 0);
    }
    else if (pos.type === mat_constants_1.default.pointType.extreme) {
        let r = mat_constants_1.default.maxOsculatingCircleRadius;
        let p = [pos.p[0], pos.p[1] - r];
        return new circle_1.default(p, r);
    }
    return PointOnShape.calcOsculatingCircle(pos.bezierNode.item, pos.t);
});
/**
* Compares two PointOnShapes according to their position on the bezier loop.
*/
PointOnShape.compare = function (a, b) {
    if (a === undefined || b === undefined) {
        return undefined;
    }
    let res;
    res = a.bezierNode.item.indx - b.bezierNode.item.indx;
    if (res !== 0) {
        return res;
    }
    res = a.t - b.t;
    if (res !== 0) {
        return res;
    }
    res = a.order - b.order;
    if (res !== 0) {
        return res;
    }
    res = a.order2 - b.order2;
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
    let circleDirection = flo_vector2d_1.default.toUnitVector(flo_vector2d_1.default.fromTo(pos.p, circle.center));
    // If not almost pointing straight up
    if (Math.abs(circleDirection[0]) > 1e-6 ||
        circleDirection[1] > 0) {
        return false;
    }
    return true;
};
/**
 * Sets the order (to distinguish between points lying on top of each
 * other) of the contact point if it is a dull corner.
 * @param {PointOnShape} pos
 * @note Modifies pos
 */
PointOnShape.setPointOrder = function (shape, circle, pos) {
    let dullCorner = PointOnShape.dullCornerAt(shape, pos.p);
    if (!dullCorner) {
        return;
    }
    let ps = dullCorner.beziers[0];
    let tan1pre = flo_bezier3_1.default.tangent(ps, 1);
    let tan1 = [tan1pre[1], -tan1pre[0]]; // rotate by -90 degrees
    let tan2 = flo_vector2d_1.default.toUnitVector(flo_vector2d_1.default.fromTo(pos.p, circle.center));
    pos.order = -flo_vector2d_1.default.dot(tan1, tan2);
    return pos.order;
};
/**
 * Creates a string key that only depends on the PointOnShape's coordinates.
 */
PointOnShape.makeSimpleKey = function (p) {
    return '' + p[0] + ', ' + p[1];
};
/**
 * @description Returns a human-readable string of the PointOnShape.
 * @note For debugging only.
 */
PointOnShape.toHumanString = function (pos) {
    return '' + pos[0] + ', ' + pos[1] +
        ' | bz: ' + pos.bezierNode.item.indx +
        ' | t: ' + pos.t +
        ' | ord: ' + pos.order +
        ' | ord2: ' + pos.order2 + ' | ' +
        PointOnShape.typeToStr(pos.type); // TODO - use enum
};
exports.default = PointOnShape;
