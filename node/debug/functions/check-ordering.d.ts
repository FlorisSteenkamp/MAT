import { Loop } from "flo-boolean";
import { LlRbTree } from "flo-ll-rb-tree";
import { CpNode } from "../../cp-node/cp-node.js";
declare function checkOrdering(cpTrees: Map<Loop, LlRbTree<CpNode>>, cpStart: CpNode): void;
export { checkOrdering };
