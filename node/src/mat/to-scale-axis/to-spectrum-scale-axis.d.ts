import { Mat } from '../../mat';
/**
 * TODO - to be finished - don't use!
 * Apply an enhanced version of the Scale Axis Transform (SAT) to the MAT
 * without pre-specifying the scale. An ordered array of SAT's are returned,
 * such that each consecutive SAT has an additional branch snipped. The scale
 * for each SAT is also returned.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT.
 */
declare function toSpectrumScaleAxis(mat: Mat, s: number): Mat;
export { toSpectrumScaleAxis };
