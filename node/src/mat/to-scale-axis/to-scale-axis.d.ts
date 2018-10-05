import { Mat } from '../../mat';
/**
 * Apply an enhanced version of the Scale Axis Transform (SAT) to the MAT.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
declare function toScaleAxis(mat: Mat, s: number): Mat;
export { toScaleAxis };
