/**
 * Evaluates the given bezier curve at the parameter t. This function is
 * curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t - The parameter value where the bezier should be evaluated
 * @returns The resultant point.
 **/
declare function evaluate(ps: number[][]): (t: number) => number[];
declare function evaluate(ps: number[][], t: number): number[];
export { evaluate };
