"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("./point-on-shape");
class ContactPoint {
    /**
     * Representation of a point on a loop (or shape).
     * @param pointOnShape
     * @param vertex
     */
    constructor(pointOnShape, circle, order, order2) {
        this.pointOnShape = pointOnShape;
        this.circle = circle;
        this.order = order;
        this.order2 = order2;
    }
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
