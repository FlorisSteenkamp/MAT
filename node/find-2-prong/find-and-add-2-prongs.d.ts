import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Find and add two-prongs.
 * @param meta
 * @param angleIncrement
 * @param for2Prongs
 * @param for1Prong
 */
declare function findAndAdd2Prongs(meta: MatMeta, angleIncrement: number, for2Prongs: PointOnShape[], for1Prong: boolean): import("../index.js").CpNode | undefined;
export { findAndAdd2Prongs };
