import type { Mat } from './mat.js';
/**
 * Trims the given Medial Axis Transform so that only cycles remain. Similar to
 * toScaleAxis(mat, Infinity).
 *
 * * returns `undefined` if the MAT has no cycles (i.e. the shape has no holes)
 *
 * @param mat The MAT to trim (it is not modified).
 */
declare function trimMat(mat: Mat): Mat | undefined;
export { trimMat };
