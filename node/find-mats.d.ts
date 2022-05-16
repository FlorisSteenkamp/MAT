import { Mat } from './mat.js';
/**
 * Finds and returns the Medial Axis Transforms (MATs) from the given array of
 * bezier loops representing shape boundaries.
 *
 * @param bezierLoops An array of (possibly intersecting) loops with each loop
 * representing one or more piecewise smooth closed curves (i.e. shapes). Each
 * loop consists of an array of beziers represented by an array of control
 * points with 2,3 or 4 elements corresponding to linear, quadratic and cubic
 * beziers respectively. Each point is a two-element array (ordered pair), the
 * first of which is the x-coordinate and the second the y-coordinate.
 *
 * @param maxCurviness The maximum value the 'curviness' of a curve can have
 * before an additional MAT point is inserted in between. Defaults to 0.4.
 * (Curviness is measured as the total angle in radians between the consecutive
 * vectors formed by the ordered control points of th bezier curve). The value
 * is clipped in the range `[0.05,3]`.
 * @param maxLength The maximum length a curve can have before an additional MAT
 * point is inserted. This value is scaled to a reference 1024 x 1024
 * grid (e.g. if the shape fits in a 512 x 512 axis-aligned box the value will be
 * halved, e.g. from 10 to 5). Together with maxCurviness it represents a
 * tolerance for the accuracy of the MAT. Defaults to 4. The value is clipped
 * in [1,100].
 */
declare function findMats(bezierLoops: number[][][][], maxCurviness?: number, maxLength?: number): Mat[];
export { findMats };
