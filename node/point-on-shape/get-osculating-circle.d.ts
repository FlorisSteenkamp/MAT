import type { PrePointOnShape } from './point-on-shape.js';
/**
 * Returns the osculating circle at this point of the curve.
 *
 * @param minCurvature if not `Infinity` then the circle radius will be limited
 * to this value
 * @param pos the `PointOnShape` identifying the point
 * @param useMaxRadius
 */
declare function getOsculatingCircle(maxOsculatingCircleRadius: number, pos: PrePointOnShape, norm: number[]): [number[], number];
export { getOsculatingCircle };
