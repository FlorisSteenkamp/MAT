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
 * @param maxFlatness The maximum value the flatness of a curve can have before
 * an additional MAT point is added in between. Defaults to 1.01. (Flatness is
 * measured as the total distance between control points of a curve divided by
 * the length of the curve. The value cannot be lower than 1.001 and must be
 * less than 2.
 * @param maxLength The maximum length a curve can have before an additional MAT
 * point is added in between. Together with maxFlatness it represents a
 * tolerance for the accuracy of the MAT. Defaults to 10. The value cannot be
 * lower than 1 or higher than 1000.
 */
declare function findMats(bezierLoops: number[][][][], maxFlatness?: number, maxLength?: number): Mat[];
export { findMats };
