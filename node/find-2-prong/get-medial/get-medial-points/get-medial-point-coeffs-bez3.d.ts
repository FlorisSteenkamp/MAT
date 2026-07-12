/**
 * Returns polynomial coefficients for ray parameter values `t`, bezier
 * parameter values `s` and medial points for points `q(t)` and b(s) (an order
 * 3 bezier curve) that satisfy the medial condition with respect to `p` and `ps`:
 *
 * Let `p` be a fixed point in the plane.
 * Let `v` be a direction vector defining the ray `q(t) = p + t⋅v`.
 * Let `ps` be a cubic bezier curve.
 *
 * * `q(t)` is equidistant from `p` and the nearest point on `ps`
 * * that common distance is locally minimal among such candidates
 *
 * In other words, this function returns candidate ray parameters for the
 * sought medial point(s). Selecting physically valid solutions (if needed)
 * is done by the caller or by a later stage of this routine.
 *
 * @param p base point
 * @param v ray direction from `p`
 * @param ps cubic bezier control points, i.e. an order 3 bezier curve
 * given as an array of control points, e.g. `[[0,0],[1,1],[2,1],[3,0]]`
 */
declare function getMedialPointCoeffsBez3(p: number[], v: number[], ps: number[][]): {
    A: number[];
    B: number[];
    C: number[];
    D: number[];
    H: number[];
};
export { getMedialPointCoeffsBez3 };
