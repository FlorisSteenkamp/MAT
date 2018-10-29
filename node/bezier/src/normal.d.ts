/**
 * Returns the normal unit vector of a cubic bezier curve at a specific t. This
 * function is curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t - The parameter value where the normal should be evaluated
 */
declare function normal(ps: number[][], t: number): number[];
declare function normal(ps: number[][]): (t: number) => number[];
export { normal };
