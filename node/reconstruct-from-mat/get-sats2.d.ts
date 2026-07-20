import type { Mat } from '../mat/mat.js';
/**
 * Returns the shape information.
 *
 * @param font$$ the font from which the glyph outlines will be retrieved
 * @param glyphId the glyph id for which the shape is to be retrieved
 * @param options the options for SAT computation
 */
declare function getSats2(mats: Mat[], satScale: number): Mat[];
export { getSats2 };
