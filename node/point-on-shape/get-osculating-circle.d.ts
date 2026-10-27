import type { PrePointOnShape } from './point-on-shape.js';
/**
 * Returns the osculating circle at this point of the curve as
 * `[center, radius]`.
 *
 * @param maxRadius the circle radius will be limited to this
 * value (i.e. the curvature is taken to be at least its reciprocal)
 * @param pos the `PointOnShape` identifying the point
 * @param norm the (not necessarily unit) normal at the point pointing towards
 * the center of the circle
 */
declare function getOsculatingCircle(minRadius: number, maxRadius: number, pos: PrePointOnShape, norm: number[]): [number[], number] | undefined;
/**
 * Returns the curvature of the given bezier curve at `t`
 *
 * * intermediate calculations done in double-double precision
 * * returns `±Infinity` instead of `NaN` for infinite curvature, i.e. at an
 * end where the first derivative vanishes (signed by the side the curve
 * bends to) or at an interior cusp (always `+Infinity`)
 *
 * @param ps
 * @param t
 */
declare function getCurvature(ps: number[][], t: number): number;
export { getOsculatingCircle, getCurvature };
