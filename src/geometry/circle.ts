import { squaredDistanceBetween } from 'flo-vector2d';


/**
 * Canonical circle representation.
 */
interface Circle {
    readonly center: number[];
    readonly radius: number;
}


/**
 * Returns a scaled version of the given circle without changing its center.
 * @param circle
 * @param s multiplier
 */
function scaleCircle(circle: Circle, s: number): Circle {
    return { center: circle.center, radius: s * circle.radius };
}


/**
 * Returns true if the first circle engulfs the second.
 * @param c1 
 * @param c2 
 */
function engulfsCircle(c1: Circle, c2: Circle) {
    if (c1.radius <= c2.radius) { 
        return false; 
    }

    const d = squaredDistanceBetween(c1.center, c2.center);
    const dr = c1.radius - c2.radius; 
    const δ = dr*dr;

    return δ > d;
}


export type { Circle }
export { scaleCircle, engulfsCircle }
