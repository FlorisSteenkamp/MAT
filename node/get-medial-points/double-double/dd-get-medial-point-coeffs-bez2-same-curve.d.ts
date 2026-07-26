/**
 * Returns polynomial coefficients for the same-curve quadratic medial-point
 * case, where `p = b(t)` on the same quadratic bezier `ps` and `v` is normal
 * to the curve at that parameter `t`.
 *
 * The returned coefficients encode:
 * * `A`, `B`: `E2(s, τ) = (s - t)^2⋅(A(s)⋅τ + B(s))`
//  * * `C`, `D`: `E1(s, τ) = C(s)⋅τ + D(s)`
 * * `H`: the reduced eliminant in `s`
 *
 * Here `τ` is the ray parameter in `q(τ) = p + τ⋅v`.
 * For a candidate root `s` of `H`, recover `τ` from
 * `A(s)⋅τ + B(s) = 0`, i.e. `τ = -B(s)/A(s)` when `A(s) ≠ 0`.
 *
 * In this same-curve setup, the full eliminant has the form
 * `H_full(s) = (s - t)^4*(l1*s + l0)`. This function returns only the reduced
 * factor `H(s) = l1*s + l0` (the repeated `(s - t)^4` factor is omitted).
 *
 * @param t parameter on `ps` where `p = b(t)`
 * @param v ray direction from `p`; assumed normal to `ps` at `t`
 * @param ps order 2 bezier control points, e.g. `[[0,0],[1,1],[2,1]]`
 */
declare function ddGetMedialPointCoeffsBez2_SameCurve(t: number, v: number[][], ps: number[][]): {
    A: number[][];
    B: number[][];
    H: number[][];
};
export { ddGetMedialPointCoeffsBez2_SameCurve };
