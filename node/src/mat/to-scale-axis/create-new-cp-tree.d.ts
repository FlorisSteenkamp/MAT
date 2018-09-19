import LlRbTree from 'flo-ll-rb-tree';
import { CpNode } from '../../cp-node';
import { Loop } from '../../loop';
declare function createNewCpTree(cpNode: CpNode): Map<Loop, LlRbTree<CpNode>>;
export { createNewCpTree };
