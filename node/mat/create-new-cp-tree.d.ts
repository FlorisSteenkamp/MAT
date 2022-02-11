import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from '../cp-node.js';
import { Loop } from '../loop.js';
/**
 * @hidden
 * @param cpNode
 */
declare function createNewCpTree(cpNode: CpNode): Map<Loop, LlRbTree<CpNode>>;
export { createNewCpTree };
