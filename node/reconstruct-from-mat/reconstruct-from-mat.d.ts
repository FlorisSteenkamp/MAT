import type { Mat } from '../mat/mat.js';
/**
 * * used for debugging only
 *
 * @param mats
 *
 * @internal
 */
declare function reconstructFromMats(mats: Mat[], minNumAccurateBits?: number | undefined): number[][][][][];
export { reconstructFromMats };
