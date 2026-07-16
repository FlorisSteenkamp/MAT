import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * Find and add two-prongs.
 * @param meta
 * @param angleIncrement
 * @param for2Prongs
 * @param for1Prong
 *
 * @internal
 */
declare function findAndAdd2Prongs(meta: MatMeta, angleIncrement: number, for2Prongs: PrePointOnShape[], for1Prong: boolean): import("../index.js").CpNode | undefined;
export { findAndAdd2Prongs };
