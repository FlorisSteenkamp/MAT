/**
 * Returns the polynomial coefficients used to recover ray parameter values `t`
 * for a ray `q(t) = p + t⋅v` and an order-1 bezier curve `ps`.
 *
 * The returned polynomials encode the medial-condition equations in `s` and
 * `t`. For any valid solution, `t` is recovered by eliminating `s` and solving
 * the resulting ray equation, or equivalently by using the linear form
 * `A(s)⋅t + B(s) = 0`, which gives `t = -B(s)/A(s)`.
 *
 * More specifically, the returned values represent:
 * * `A` and `B`: the coefficients of `E2(s,t) = A(s)⋅t + B(s)`
 * * `C` and `D`: the coefficients of `E1(s,t) = C(s)⋅t + D(s)`
 * * `H`: the eliminated polynomial `A(s)⋅D(s) - B(s)⋅C(s)` whose roots are
 *   candidate `s` values for medial points
 *
 * @param p base point
 * @param v ray direction vector starting from `p`
 * @param ps order 1 bezier control points, i.e. a line segment
 * given as an array of control points, e.g. `[[0,0],[2,1]]`
 */
declare function ddGetMedialPointCoeffsBez1(p: number[][], v: number[][], ps: number[][]): {
    A: number[][];
    B: number[][];
    C: number[][];
    D: number[][];
    H: number[][];
};
export { ddGetMedialPointCoeffsBez1 };
