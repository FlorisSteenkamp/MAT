import type { PrePointOnShape } from './point-on-shape.js';
/**
 * Returns the osculating circle at this point of the curve as
 * `[center, radius]`.
 *
 * @param maxOsculatingCircleRadius the circle radius will be limited to this
 * value (i.e. the curvature is taken to be at least its reciprocal)
 * @param pos the `PointOnShape` identifying the point
 * @param norm the (not necessarily unit) normal at the point pointing towards
 * the center of the circle
 */
declare function getOsculatingCircle(maxOsculatingCircleRadius: number, pos: PrePointOnShape, norm: number[]): [number[], number];
export { getOsculatingCircle };
