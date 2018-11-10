/**
 * Returns the x value of the once differentiated (with respect to t) cubic
 * bezier when evaluated at t. This function is curried.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @param t - The t parameter
  */
declare function evaluateDx(ps: number[][], t: number): number;
declare function evaluateDx(ps: number[][]): (t: number) => number;
export { evaluateDx };
