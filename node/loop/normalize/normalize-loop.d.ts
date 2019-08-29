import { Loop } from "../loop";
/**
 * @hidden
 * Returns loops that is the result of putting the given loops in general
 * position (loosely speaking). The modifications to the input loop should be
 * such that no discernable visual changes occur.
 *
 * The following guarantees are put in place for the returned loops:
 * * No bezier is of zero length.
 * * All points are coerced onto a grid. In other words, such that the
 * significand of all points are reduced to a specified number of bits and the
 * significant bits of all points overlap.
 * * All bezier points of a single curve are seperated - this prevents infinite
 * curvature at the endpoints, etc.
 * * TODO - All curves are x-monotone (i.e. the x-coordinate of any bezier curve is a
 * (non-strict) increasing (or decreasing) function of its parameter)
 * * TODO - All curves are y-monotone (i.e. the y-coordinate of any bezier curve is a
 * (non-strict) increasing (or decreasing) function of its parameter)
 * * No two bezier curves are in the same K-family (i.e. the same curve when the
 * parameter can vary in [-inf, +inf]) unless they are non-intersecting.
 * * TODO - no bezier cusps
 * * TODO - no bezier self-intersections (including single bezier closed loops)
 * * No self-intersections at infinitely many points, i.e.
 * where the curve goes back on itself.
 *
 * This gives us some good guarantees for the rest of the algorithm. In
 * particular, the algorithms is made much less complex and runs much faster.
 *
 * @param loop
 * @param maxCoordinate
 */
declare function normalizeLoops(bezierLoops: number[][][][], maxBitLength: number): Loop[];
export { normalizeLoops };
