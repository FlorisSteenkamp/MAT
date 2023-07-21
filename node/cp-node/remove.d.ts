import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from "./cp-node.js";
/**
 * Removes a cpNode from the MAT.
 * @param cpTree The tree graph holding the [[CpNodes]] of the MAT.
 * @param cpNode The [[CpNode]] to remove.
 */
declare function removeCpNode(cpNode: CpNode, cpTree?: LlRbTree<CpNode>): void;
export { removeCpNode };
