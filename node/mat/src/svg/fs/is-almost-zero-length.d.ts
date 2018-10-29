/**
 * Returns true if distance between consecutive points are all less than
 * some delta, false otherwise.
 * @private
 * @param ps - an array of points
 * @param delta - a tolerance - defaults to 1e-6;
 */
declare function isAlmostZeroLength(ps: number[][], delta?: number): boolean;
export { isAlmostZeroLength };
