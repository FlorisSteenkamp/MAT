/**
 * Returns the derivative of the power basis representation of the bezier's
 * x-coordinates. This function is memoized on its points parameter by object
 * reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 */
declare let getDx: (a: number[][]) => number[];
export { getDx };
