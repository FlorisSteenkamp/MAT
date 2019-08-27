/**
 * Returns the same bezier if its points are well-spaced, e.g. all points not
 * coincident, etc., else fix it, if possible, and return the fixed bezier,
 * else return undefined.
 * @param ps A bezier
 */
declare function fixBezierByPointSpacing(ps: number[][], gridSpacing: number, sendToGrid: (p: number[]) => number[]): number[][];
export { fixBezierByPointSpacing };
