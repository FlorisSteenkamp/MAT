/**
 * Returns the *squared* separation tolerance between the two contact points
 * `y` (the source point) and `z` (the antipode) of a candidate 2-prong: if
 * `|yz|²` is below it the antipode is indistinguishable (to within the error
 * tolerance `δ`) from the circle merely grazing the boundary at `y` - the
 * near-1-prong case - and the 2-prong should be rejected.
 *
 * Derivation: the MAT circle (radius `r`) is tangent to the boundary at `y`
 * and so is the osculating circle there (radius `R`), both centers lying on
 * the inward normal at `y`. Approximating the boundary near `y` by the
 * osculating circle, the MAT circle enlarged by `δ` crosses it at the angle
 * `θ` (at the MAT center, measured from `y`) given by the law of cosines:
 *
 *     cos θ = (r(R-r) - rδ - δ²/2) / ((R-r)(r+δ))
 *
 * Points of the MAT circle within that angle of `y` are within `δ` of the
 * boundary. The chord `|yz|` subtending `θ` is `2r·sin(θ/2)`, and since
 * `2sin²(θ/2) = 1 - cos θ = (Rδ + δ²/2) / ((R-r)(r+δ))` the squared chord is
 *
 *     |yz|² = r²(2Rδ + δ²) / ((R-r)(r+δ))
 *
 * which is what is returned - in closed form, without the cancellation that
 * recovering a tiny `θ` from `cos θ` suffers from.
 *
 * @param R radius of the osculating circle of the boundary at `y`
 * @param r radius of the MAT circle
 * @param δ the error tolerance on distances
 *
 * @internal
 */
declare function calcSquaredSeperationTolerance(R: number, r: number, δ: number): number;
export { calcSquaredSeperationTolerance };
