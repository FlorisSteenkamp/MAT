/**
 * Returns a positive value if the second bezier (of order 1, 2 or 3) curves
 * anti-clockwise with respect to the first at the point where the first bezier
 * ends and the second one starts. Returns a negative number if the turn is
 * clockwise. Returns 0 otherwise.
 *
 * The algorithm is a generalization of `ccw`, a.k.a `orient2d`.
 *
 * The above obviously necessitates that their endpoints coincide as described.
 *
 * Preconditions (for robustness):
 * * The beziers has control points with max bit-length of 25 and bit-aligned.
 * * The bezier does not have infinite curvature at either endpoint
 *
 * This is so the vectors between control points can be
 * calculated exactly without resorting to adaptive infinite precision floating
 * point operations. Note: aligned to 'grid' here means if you bitwise-and all
 * values together the resulting bitlength === the max bithlength of any value.
 *
 * @param psI The incoming bezier that ends at the interface
 * @param psO The outgoing bezier that starts at the interface
 */
declare function getInterfaceCcw(psI: number[][], psO: number[][]): number;
export { getInterfaceCcw };
