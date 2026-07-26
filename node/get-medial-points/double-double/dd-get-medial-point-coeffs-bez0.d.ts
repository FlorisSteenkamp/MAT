/**
 * Returns the coefficients `a0` and `b0` for the linear equation
 * `a0⋅t + b0 = 0`, so the ray parameter can be recovered as `t = -b0/a0`.
 * That parameter value makes `q(t) = p + t⋅v` equidistant from `p` and `P`.
 *
 * Let `p` be a fixed point in the plane.\
 * Let `v` be a direction vector defining the ray `q(t) = p + t⋅v`.\
 * Let `P` be another point.\
 *
 * In other words, this function returns the coefficients needed to solve for
 * the ray parameter of the medial point on the ray.
 *
 * @param p base point
 * @param v ray direction from `p`
 * @param P another "target" point, e.g. `[1,2]`
 */
declare function ddGetMedialPointCoeffsBez0(p: number[][], v: number[][], P: number[]): {
    a0: number[];
    b0: number[];
};
export { ddGetMedialPointCoeffsBez0 };
