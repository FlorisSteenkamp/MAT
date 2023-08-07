import { Loop } from 'flo-boolean';
import { Mat } from '../mat/mat.js';
/**
 * @internal
 * Find the MAT of the given loops.
 * @param loops The loops (that as a precondition must be ordered from highest
 * (i.e. smallest y-value) topmost point loops to lowest)
 */
declare function findMat(loops: Loop[], minBezLength: number, maxCurviness: number, maxLength: number, maxCoordinate: number): Mat;
export { findMat };
