"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
class Circle {
    /**
    * @param center
    * @param radius
    */
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
    }
    /**
     * Returns a scaled version of the given circle without
     * changing its center position.
     * @param circle
     * @param s multiplier
     */
    static scale(circle, s) {
        return new Circle(circle.center, circle.radius * s);
    }
    /**
     * Returns true if the first circle engulfs the second.
     */
    static engulfsCircle(c1, c2) {
        if (c1.radius <= c2.radius) {
            return false;
        }
        let d = flo_vector2d_1.default.squaredDistanceBetween(c1.center, c2.center);
        let dr = c1.radius - c2.radius;
        let δ = dr * dr;
        return δ > d;
    }
    /**
     * Returns a human-readable string description.
     */
    static toString(circle) {
        return 'c: ' + circle.center + ' radius: ' + circle.radius;
    }
}
exports.default = Circle;
