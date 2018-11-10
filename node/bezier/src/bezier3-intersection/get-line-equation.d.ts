/**
 * Get the implicit line equation from two 2d points in the form f(x,y) ax + by + c = 0
 * returned as the array [a,b,c].
 * @param l - A line given by two points, e.g. [[2,0],[3,3]]
 */
declare function getLineEquation(l: number[][]): number[];
export { getLineEquation };
