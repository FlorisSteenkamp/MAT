import { Mat } from './mat';
/**
 * Finds and returns the Medial Axis Transforms (MATs) from the given array of
 * bezier loops representing shape boundaries.
 * @param bezierLoops An array of (possibly intersecting) loops with each loop
 * representing one or more piecewise smooth closed curves (i.e. shapes). Each
 * loop consists of an array of beziers represented by an array of control
 * points with 2,3 or 4 elements corresponding to linear, quadratic and cubic
 * beziers respectively. Each point is a two-element array (ordered pair), the
 * first of which is the x-coordinate and the second the y-coordinate.
 * @param maxFlatness The maximum value the flatness of a curve can have before
 * an additional MAT point is added in between. Defaults to 1.01. (Flatness is
 * measured as the total distance between control points of a curve divided by
 * the length of the curve.) The is clipped in [1.001,2]..
 * @param maxLength The maximum length a curve can have before an additional MAT
 * point is added in between. This value is scaled to a reference 1024 x 1024
 * grid (e.g. if the shape fits in a 512 x 512 axis-aligned box the will be
 * halved, e.g. from 10 to 5). Together with maxFlatness it represents a
 * tolerance for the accuracy of the MAT. Defaults to 4. The value is clipped
 * in [1,100].
 */
declare function findMats(bezierLoops: number[][][][], maxFlatness?: number, maxLength?: number): Mat[];
export { findMats };
