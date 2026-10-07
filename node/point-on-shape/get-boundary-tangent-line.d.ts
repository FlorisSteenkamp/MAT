import type { PointOnShape } from './point-on-shape.js';
/**
 * Returns a line segment starting at the given point on the shape boundary and
 * being tangent to the boundary at that point.
 *
 * * the returned line is of the form `[p, p + tangent]` where `p` is the
 * point on the shape (the tangent is not normalized)
 * * if the point falls on the boundary between two curves then the curve
 * the point starts (if `fromElseTo` is `true`) or ends (if `fromElseTo` is
 * `false`) is used
 *
 * @param pos the point on the shape
 * @param fromElseTo `true` if the tangent is to be taken as leaving the point,
 * `false` if it is to be taken as arriving at the point
 *
 * @internal
 */
declare function getBoundaryTangentLine(pos: PointOnShape, fromElseTo: boolean): number[][];
export { getBoundaryTangentLine };
