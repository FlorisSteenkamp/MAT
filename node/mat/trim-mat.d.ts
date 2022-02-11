import { Mat } from '../mat.js';
/**
 * Trims the given Medial Axis Transform so that only cycles remain. Similar to
 * toScaleAxis(mat, Number.POSITIVE_INFINITY).
 * @param mat The MAT to trim.
 */
declare function trimMat(mat: Mat): Mat;
export { trimMat };
