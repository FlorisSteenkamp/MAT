/**
 * Returns an array of 1 or 2 bezier curves (each a line or a quadratic) that
 * together form a smooth curve from the start point of `l0` to the start point
 * of `l1` such that the curve is tangent to `l0` at its start and tangent to
 * `l1` at its end.
 *
 * * `l0` and `l1` are given as `[p, p + dir]` where `p` is the curve endpoint
 * and `dir` is the tangent direction pointing in the direction of travel along
 * the curve (i.e. into the curve at the start and out of the curve at the end)
 * * if the tangent lines are not 'twisted' a single quadratic is returned
 * * if the tangent lines are 'twisted' (the curve must have an inflection)
 * either 2 quadratics joined smoothly at the inflection (or, if the deviation
 * from a straight line is small enough, a single line) are returned as an
 * approximation
 *
 * @param l0 the tangent line at the start of the curve
 * @param l1 the tangent line at the end of the curve
 *
 * @internal
 */
declare function getBeziersFromTangents(l0: number[][], l1: number[][]): number[][][];
export { getBeziersFromTangents };
