import { Loop } from 'flo-boolean';
import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from "../cp-node.js";
declare function removeCpNode(cpNode: CpNode, cpTrees: Map<Loop, LlRbTree<CpNode>>): void;
export { removeCpNode };
