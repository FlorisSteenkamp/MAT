import { Mat } from './mat';
/**
 * Find the Medial Axis Transforms (MATs) from the given array of bezier loops
 * representing shape boundaries.
 * @param bezierLoops An array of (possibly intersecting) loops with each loop
 * representing one or more piecewise smooth closed curves (i.e. shapes). Each
 * loop consists of an array of beziers represented by an array of control
 * points with 2,3 or 4 elements corresponding to linear, quadratic and cubic
 * beziers respectively. Each point is a two-element array (ordered pair), the
 * first of which is the x-coordinate and the second the y-coordinate.
 * @param additionalPointCount Additional points per bezier where a MAT circle
 * will be added. Defaults to 3.
 */
declare function findMats(bezierLoops: number[][][][], additionalPointCount?: number): Mat[];
export { findMats };
