/**
 * Returns the bezier t values of the intersection between the given cubic
 * bezier and the given line.
 * @param ps - The bezier curve
 * @param l - The line given as a start and end point
 */
declare function lineIntersection(ps: number[][], l: number[][]): number[];
export { lineIntersection };
