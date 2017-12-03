"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const point_on_shape_1 = require("../../geometry/classes/point-on-shape");
/**
 * Class representing a single contact point of a MatCircle.
 *
 * @param pointOnShape
 * @param {MatCircle} matCircle
 */
class ContactPoint {
    constructor(pointOnShape, matCircle) {
        this.pointOnShape = pointOnShape;
        this.matCircle = matCircle;
        this.key = point_on_shape_1.default.toHumanString(pointOnShape); // TODO - remove
        // TODO - remove from cache?
        this[0] = pointOnShape[0]; // Shortcut
        this[1] = pointOnShape[1]; // ...
    }
    static compare(a, b) {
        return point_on_shape_1.default.compare(a.pointOnShape, b.pointOnShape);
    }
    static equal(a, b) {
        return flo_vector2d_1.default.equal(a.pointOnShape.p, b.pointOnShape.p);
    }
}
exports.default = ContactPoint;
