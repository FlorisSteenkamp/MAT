/**
 * Returns true if the given point is close to the origin (by Manhattan
 * distance), fale otherwise.
 * @hidden
 * @param p - a point
 * @param delta - a tolerance - defaults to 1e-6;
 */
declare function isCloseToOrigin(p: number[], delta?: number): boolean;
export { isCloseToOrigin };
