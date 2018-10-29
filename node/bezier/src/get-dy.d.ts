/**
 * Returns the derivative of the power basis representation of the bezier's
 * y-coordinates. This function is memoized on its points parameter by object
 * reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The differentiated power basis polynomial from highest
 * power to lowest, e.g. at^2 + bt + c is returned as [a,b,c]
 */
declare let getDy: (a: number[][]) => number[];
export { getDy };
