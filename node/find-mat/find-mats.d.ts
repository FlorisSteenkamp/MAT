import { Mat } from '../mat/mat.js';
import { MatOptions } from './mat-options.js';
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
 * @param options the `MatOptions` (see there for a description of each option
 * and its default), e.g. `maxCurviness` and `maxLength` together determine the
 * accuracy of the MAT, `simplify` and `simplifyTolerance` control the
 * simplification of the result and `applySat` and `satScale` whether and how
 * the Scale Axis Transform is applied. Missing options take their defaults
 * (`defaultMatOptions`) and all values are clipped to their allowed ranges.
 */
declare function findMats(bezierLoops: number[][][][], options?: MatOptions): Mat[];
export { findMats };
