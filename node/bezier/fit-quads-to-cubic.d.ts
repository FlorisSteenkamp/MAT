/**
 * TODO2 - change description - just basically copied from flo-bezier3
 * Approximate the given cubic bezier curve (up to the given tolerance) by
 * fitting an array of ordered (by `t` value) piecewise bezier curves
 * (of quadratic order or less).
 *
 * * the start and end point of each approximating curve lies on the cubic
 * curve and the the tangents of each approximating curve coincide with that of
 * the cubic at each such point
 *
 * @param ps a cubic bezier curve given as an ordered array of its
 * control point coordinates, e.g. `[[0,0], [1,1], [2,1], [2,0]]`
 * @param tolerance tolerance given as the maximum total absolute area difference
 * between the two curves
 *
 * @doc mdx
 */
declare function fitQuadsToCubicTsOnly(ps: number[][], tolerance: number): number[];
export { fitQuadsToCubicTsOnly };
