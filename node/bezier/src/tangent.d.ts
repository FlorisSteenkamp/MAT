/**
 * Returns the tangent unit vector of a cubic bezier curve at a specific t. This
 * function is curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t - The parameter value where the tangent should be evaluated
 * @returns {number[]}
 */
declare function tangent(ps: number[][], t: number): number[];
declare function tangent(ps: number[][]): (t: number) => number[];
export { tangent };
