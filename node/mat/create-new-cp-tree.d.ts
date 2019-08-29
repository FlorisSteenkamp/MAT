import LlRbTree from 'flo-ll-rb-tree';
import { CpNode } from '../cp-node/cp-node';
import { Loop } from '../loop/loop';
/**
 * @hidden
 * @param cpNode
 */
declare function createNewCpTree(cpNode: CpNode): Map<Loop, LlRbTree<CpNode>>;
export { createNewCpTree };
