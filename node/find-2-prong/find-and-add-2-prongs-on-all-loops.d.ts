import type { CpNode } from '../cp-node/cp-node.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Add 2 prongs. See comments on the add2Prong function.
 *
 * @param meta
 * @param angleIncrement
 * @param for2Prongss
 * @param for1Prongs
 */
declare function findAndAdd2ProngsOnAllLoops(meta: MatMeta, angleIncrement: number, for2Prongss: PrePointOnShape[][], for1Prongs: boolean): CpNode | undefined;
export { findAndAdd2ProngsOnAllLoops };
