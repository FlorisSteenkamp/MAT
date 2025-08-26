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
 * * The bezier does not have infinite curvature at either endpoint
 *
 * @param psI The incoming bezier that ends at the interface
 * @param psO The outgoing bezier that starts at the interface
 */
declare function getInterfaceCcw(psI: number[][], psO: number[][]): {
    ccw: number;
    tangentI: number[][];
    tangentO: number[][];
    dotTangents: number;
};
export { getInterfaceCcw };
