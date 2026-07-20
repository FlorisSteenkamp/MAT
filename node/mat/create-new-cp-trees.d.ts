import type { Loop } from 'flo-boolean';
import type { CpNode } from '../cp-node/cp-node.js';
import { RbTree } from 'flo-ll-rb-tree';
/**
 * @param cpNode
 *
 * @internal
 */
declare function createNewCpTrees(cpNode: CpNode): Map<Loop, RbTree<CpNode>>;
export { createNewCpTrees };
