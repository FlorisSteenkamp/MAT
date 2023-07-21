import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from '../cp-node/cp-node.js';
import { Loop } from 'flo-boolean';
/**
 * @internal
 * @param cpNode
 */
declare function createNewCpTree(cpNode: CpNode): Map<Loop, LlRbTree<CpNode>>;
export { createNewCpTree };
