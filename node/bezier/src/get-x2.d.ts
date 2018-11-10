/**
 * Returns the power basis representation of the bezier's x-coordinates.
 * This function is memoized on its points parameter by object reference.
 * @param ps - A quadratic bezier, e.g. [[0,0],[1,1],[2,1]]
 * @returns The power basis polynomial from highest power to lowest,
 * e.g. at^2 + bt + c is returned as [a,b,c]
 */
declare let getX2: (a: number[][]) => number[];
export { getX2 };
