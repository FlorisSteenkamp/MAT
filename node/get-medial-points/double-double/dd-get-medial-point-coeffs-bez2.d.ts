/**
 * Returns the polynomial coefficients for the ray parameter `t` and the
 * curve parameter `s` that encode the medial condition for `q(t) = p + t⋅v`
 * and a quadratic bezier curve `ps`.
 *
 * The returned coefficients describe the equations whose common solutions
 * satisfy:
 * * `q(t)` is equidistant from `p` and the nearest point on `ps`
 * * that common distance is locally minimal among such candidates
 *
 * More specifically, this function returns:
 * * `A` and `B`: the coefficients of `E2(s,t) = A(s)⋅t + B(s)`
 * * `C` and `D`: the coefficients of `E1(s,t) = C(s)⋅t + D(s)`
 * * `H`: the eliminated polynomial `A(s)⋅D(s) - B(s)⋅C(s)` whose roots are
 *   candidate `s` values for medial points
 *
 * @param p base point
 * @param v ray direction from `p`
 * @param ps quadratic bezier control points, i.e. an order 2 bezier curve
 * given as an array of control points, e.g. `[[0,0],[1,1],[2,1]]`
 */
declare function ddGetMedialPointCoeffsBez2(p: number[][], v: number[][], ps: number[][]): {
    A: number[][];
    B: number[][];
    C: number[][];
    D: number[][];
    H: number[][];
};
export { ddGetMedialPointCoeffsBez2 };
