/**
 * Canonical circle representation.
 */
interface Circle {
    center: number[];
    radius: number;
}
/**
 * Returns a scaled version of the given circle without changing its center.
 * @param circle
 * @param s multiplier
 */
declare function scaleCircle(circle: Circle, s: number): Circle;
/**
 * Returns true if the first circle engulfs the second.
 * @param c1
 * @param c2
 */
declare function engulfsCircle(c1: Circle, c2: Circle): boolean;
export { Circle, scaleCircle, engulfsCircle };
