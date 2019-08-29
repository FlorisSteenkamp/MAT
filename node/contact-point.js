"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("./point-on-shape");
/**
 * Represents a point on the shape boundary for which MAT data has been
 * calculated.
 */
class ContactPoint {
    /**
     * @param pointOnShape Identifies the point on the shape boundary.
     * @param circle The maximal disk circle touching this point.
     * @param order Internally used to order two points lying at the same planar
     * point.
     * @param order2
     * Internally used to order two points lying at the same planar point.
     */
    constructor(pointOnShape, circle, order, order2) {
        this.pointOnShape = pointOnShape;
        this.circle = circle;
        this.order = order;
        this.order2 = order2;
    }
    /**
     * Primarily for internal use.
     *
     * Compares the two contact points according to their order along the shape
     * boundary. Returns > 0 if a > b, < 0 if a < b or 0 if a === b.
     * @param a The first contact point.
     * @param b The second contact point.
     */
    static compare(a, b) {
        let res = point_on_shape_1.PointOnShape.compare(a.pointOnShape, b.pointOnShape);
        if (res === undefined) {
            return undefined;
        }
        if (res !== 0) {
            return res;
        }
        res = a.order - b.order;
        if (res !== 0) {
            return res;
        }
        return a.order2 - b.order2;
    }
}
exports.ContactPoint = ContactPoint;
//# sourceMappingURL=contact-point.js.map