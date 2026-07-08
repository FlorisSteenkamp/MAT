import type { Mat } from './mat.js';
/**
 * Returns a new simplified MAT of the given one by replacing the piecewise
 * quad beziers composing the MAT with fewer ones to within a given tolerance.
 *
 * @param cpNode a representation of the MAT
 * @param anlgeTolerance tolerance given as the degrees difference of the unit
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required - defaults to 15
 * @param hausdorffTolerance the approximate maximum Hausdorff Distance tolerance -
 * defaults to `2**-3`
 * @param maxIterations the max iterations of the Hausdorff Distance calculation,
 * defaults to `50`
 */
declare function simplifyMat(mat: Mat, hausdorffTolerance?: number, maxIterations?: number): Mat;
export { simplifyMat };
