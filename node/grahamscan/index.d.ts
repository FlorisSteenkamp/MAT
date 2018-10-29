/**
 * <p>
 * Finds the convex hull of the given set of 2d points using the
 * Graham Scan algorithm and returns the hull as an array of points.
 * </p>
 * <p>
 * See https://en.wikipedia.org/wiki/Graham_scan
 * </p>
 * @param ps_ - A set of points
 * @param includeAllBoundaryPoints - Set this to true to if all boundary points
 * should be returned, even redundant ones - defaults to false
 * @param delta - Tolerance at which three points are considered collinear -
 * defaults to 1e-10
 */
declare function grahamScan(ps_: number[][], includeAllBoundaryPoints?: boolean, delta?: number): number[][];
export default grahamScan;
