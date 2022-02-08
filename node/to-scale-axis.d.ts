import { Mat } from './mat';
/** @hidden */
/**
 * Apply and returns an enhanced version of the Scale Axis Transform (SAT) to
 * the given MAT. The returned SAT is guaranteed to be a subset of the MAT and
 * preserves topology at any scale.
 *
 * Typically the MAT contains too many branches caused by minute details on the
 * boundary of the shape. The SAT is a simplification of the MAT that preserves
 * less detail the higher the applied scale factor. The severity at which noise
 * are removed depends on the local scale of the shape.
 * @param mat The Medial Axis Transform ([[Mat]]) on which to apply the SAT.
 * @param s The scale factor >= 1 (e.g. 1.3)
 */
declare function toScaleAxis(mat: Mat, s: number, f?: (s: number) => (r: number) => number): Mat;
export { toScaleAxis };
