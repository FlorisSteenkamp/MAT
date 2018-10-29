/**
 * Returns the power basis representation of the bezier's x-coordinates.
 * This function is memoized on its points parameter by object reference.
 * @param ps - A cubic bezier, e.g. [[0,0],[1,1],[2,1],[2,0]]
 * @returns The power basis polynomial from highest power to lowest,
 * e.g. at^3 + bt^2 + ct + d is returned as [a,b,c,d]
 */
declare let getX: (a: number[][]) => number[];
export { getX };
