import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Add 2 prongs. See comments on the add2Prong function.
 *
 * @param meta
 * @param angleIncrement
 * @param for2Prongss
 * @param for1Prongs
 */
declare function findAndAdd2ProngsOnAllLoops(meta: MatMeta, angleIncrement: number, for2Prongss: PointOnShape[][], for1Prongs: boolean): CpNode | undefined;
export { findAndAdd2ProngsOnAllLoops };
