import { PointOnShape } from "./point-on-shape.js";
/**
 * Calculates and returns the osculating circle radius of the bezier at a
 * specific t. If it is found to have negative or nearly zero radius
 * it is clipped to have positive radius so it can point into the shape.
 * @param ps
 * @param t
 * @internal
 */
declare const calcOsculatingCircleRadius: (a: PointOnShape) => number;
export { calcOsculatingCircleRadius };
