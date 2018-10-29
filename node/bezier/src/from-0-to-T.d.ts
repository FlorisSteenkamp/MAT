/**
 * Returns a cubic bezier curve that starts at the given curve's t=0 and ends
 * at the given t parameter. Uses de Casteljau's algorithm.
 *
 * A loose bound on the accuracy of the resultant points is given by:
 * |δP| = 2n*max_k(|b_k|)η, where n = 3 (cubic), b_k are the control points
 * abd η is Number.EPSILON.
 * @param ps - A cubic bezier curve
 * @param t - The t parameter where the resultant bezier should end
 */
declare function from0ToT(ps: number[][], t: number): number[][];
export { from0ToT };
