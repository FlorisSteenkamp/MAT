
import { squaredDistanceBetween } from 'flo-vector2d';


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
function scaleCircle(circle: Circle, s: number) {
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
    
    let d = squaredDistanceBetween(c1.center, c2.center);
    let dr = c1.radius - c2.radius; 
    let δ = dr*dr;

    return δ > d;
}


/**
 * Returns a human-readable string description of the given circle.
 * @param circle
 */
function toString(circle: Circle): string {
    return 'c: ' + circle.center + ' r: ' + circle.radius;
}

export { Circle, scaleCircle, engulfsCircle }
