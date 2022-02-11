import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from '../../loop.js';
import { CpNode } from '../../cp-node.js';
import { IPointOnShape } from '../../point-on-shape.js';
/**
 * @hidden
 * Add 2 prongs. See comments on the add2Prong function.
 * @param loops
 * @param cpGraphs
 * @param for2Prongss
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function findAndAdd2ProngsOnAllPaths(loops: Loop[], cpGraphs: Map<Loop, LlRbTree<CpNode>>, for2Prongss: IPointOnShape[][], extreme: number): CpNode;
export { findAndAdd2ProngsOnAllPaths };
