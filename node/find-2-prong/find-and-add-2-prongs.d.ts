import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * @internal
 * Find and add two-prongs.
 * @param loops
 * @param cpGraphs
 * @param k
 * @param for2Prongs
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function findAndAdd2Prongs(loops: Loop[], cpGraphs: Map<Loop, LlRbTree<CpNode>>, k: number, for2Prongs: PointOnShape[], extreme: number, for1Prongs: boolean): CpNode | undefined;
export { findAndAdd2Prongs };
