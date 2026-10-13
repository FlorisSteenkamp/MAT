/**
 * Returns an array of 1 or 2 bezier curves (each a line or a quadratic) that
 * together form a smooth curve from the start point of `l0` to the start point
 * of `l1` such that the curve is tangent to `l0` at its start and tangent to
 * `l1` at its end.
 *
 * * `l0` and `l1` are given as `[p, p + dir]` where `p` is the curve endpoint
 * and `dir` is the tangent direction (of any magnitude; its orientation does
 * not matter)
 * * if the tangent lines are not 'twisted' (they meet strictly between the
 * endpoints along the chord) a single quadratic is returned
 * * if the tangent lines are 'twisted' (the curve must have an inflection)
 * 2 quadratics joined smoothly at the inflection are returned as an
 * approximation - or, if both tangents deviate from the chord by less than
 * `SIN_TOLERANCE_USE_LINE`, a single line
 * * if the endpoints coincide (or a tangent is degenerate) a (degenerate) line
 * is returned
 *
 * FUTURE: a strongly twisted MAT edge indicates that an additional 2-prong
 * should be added so that the edge is approximated by two less twisted ones.
 *
 * @param l0 the tangent line at the start of the curve
 * @param l1 the tangent line at the end of the curve
 *
 * @internal
 */
declare function getBeziersFromTangents(l0: number[][], l1: number[][]): number[][][];
export { getBeziersFromTangents };
