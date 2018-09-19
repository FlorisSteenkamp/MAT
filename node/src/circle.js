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
     * Returns a scaled version of the given circle without changing its center.
     * @param circle
     * @param s multiplier
     */
    static scale(circle, s) {
        return new Circle(circle.center, circle.radius * s);
    }
    /**
     * Returns true if the first circle engulfs the second.
     * @param c1
     * @param c2
     */
    static engulfsCircle(c1, c2) {
        if (c1.radius <= c2.radius) {
            return false;
        }
        let d = flo_vector2d_1.squaredDistanceBetween(c1.center, c2.center);
        let dr = c1.radius - c2.radius;
        let δ = dr * dr;
        return δ > d;
    }
    /**
     * Returns a human-readable string description of the given circle.
     * @param circle
     */
    static toString(circle) {
        return 'c: ' + circle.center + ' r: ' + circle.radius;
    }
}
exports.Circle = Circle;
