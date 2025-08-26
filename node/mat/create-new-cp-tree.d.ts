import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
/**
 * @internal
 * @param cpNode
 */
declare function createNewCpTree(cpNode: CpNode): Map<Loop, LlRbTree<CpNode>>;
export { createNewCpTree };
