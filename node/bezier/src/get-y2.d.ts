/**
 * Returns the power basis representation of the bezier's y-coordinates.
 * This function is memoized on its points parameter by object reference.
 * @param ps - A quadratic bezier, e.g. [[0,0],[1,1],[2,1]]
 */
declare let getY2: (a: number[][]) => number[];
export { getY2 };
