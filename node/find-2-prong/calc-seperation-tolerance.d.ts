/**
 * Calculates and returns an appropriate seperation tolerance between `CpNode`s.
 *
 * @param R radius of the circle implied by the curvature at the boundary
 * @param r radius of the MAT circle
 * @param θ angle between point...
 */
declare function calcSeperationTolerance(R: number, r: number, δ: number): number;
export { calcSeperationTolerance };
