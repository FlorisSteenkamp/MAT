import { Mat } from './mat.js';
/**
 * Simplifies the given MAT by replacing the piecewise quad beziers composing
 * the MAT with fewer ones to within a given tolerance.
 * @param cpNode A representation of the MAT
 * @param anlgeTolerance Tolerance given as the degrees difference of the unit
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required - defaults to 15.
 * @param hausdorffTolerance The approximate maximum Hausdorff Distance tolerance -
 * defaults to `2**-3`
 * @param maxIterations The max iterations, defaults to `50`
 */
declare function simplifyMat(mat: Mat, hausdorffTolerance?: number, maxIterations?: number): Mat;
export { simplifyMat };
