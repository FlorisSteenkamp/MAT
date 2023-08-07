import { LlRbTree } from 'flo-ll-rb-tree';
import { cpNodeComparator, getAllOnLoop } from '../cp-node/cp-node.js';
/**
 * @internal
 * @param cpNode
 */
function createNewCpTree(cpNode) {
    const newCpTrees = new Map();
    getAllOnLoop(cpNode).forEach(createNewCpTree_);
    function createNewCpTree_(cpNode) {
        const loop = cpNode.cp.pointOnShape.curve.loop;
        let cpTree = newCpTrees.get(loop);
        if (!cpTree) {
            cpTree = new LlRbTree(cpNodeComparator, false);
            newCpTrees.set(loop, cpTree);
        }
        cpTree.insert(cpNode);
    }
    return newCpTrees;
}
export { createNewCpTree };
//# sourceMappingURL=create-new-cp-tree.js.map