import { squaredDistanceBetween } from 'flo-vector2d';
/**
 * Returns a scaled version of the given circle without changing its center.
 * @param circle
 * @param s multiplier
 */
function scaleCircle(circle, s) {
    return { center: circle.center, radius: s * circle.radius };
}
/**
 * Returns true if the first circle engulfs the second.
 * @param c1
 * @param c2
 */
function engulfsCircle(c1, c2) {
    if (c1.radius <= c2.radius) {
        return false;
    }
    let d = squaredDistanceBetween(c1.center, c2.center);
    let dr = c1.radius - c2.radius;
    let δ = dr * dr;
    return δ > d;
}
/**
 * Returns a human-readable string description of the given circle.
 * @param circle
 */
function toString(circle) {
    return 'c: ' + circle.center + ' r: ' + circle.radius;
}
export { scaleCircle, engulfsCircle };
//# sourceMappingURL=circle.js.map