import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * @internal
 * Add 2 prongs. See comments on the add2Prong function.
 * @param loops
 * @param cpGraphs
 * @param for2Prongss
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function findAndAdd2ProngsOnAllPaths(cpNode: CpNode | undefined, loops: Loop[], cpGraphs: Map<Loop, LlRbTree<CpNode>>, for2Prongss: PointOnShape[][], extreme: number, for1Prongs: boolean): CpNode | undefined;
export { findAndAdd2ProngsOnAllPaths };
