import { LlRbTree } from 'flo-ll-rb-tree';
import { cpNodeComparator } from '../cp-node/fs/cp-node-comparator.js';
import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';
/**
 * @param cpNode
 *
 * @internal
 */
function createNewCpTrees(cpNode) {
    const cpTrees_ = new Map();
    getAllOnLoop(cpNode).forEach(createNewCpTree_);
    function createNewCpTree_(cpNode) {
        const loop = cpNode.pointOnShape.curve.loop;
        let cpTree = cpTrees_.get(loop);
        if (!cpTree) {
            cpTree = new LlRbTree(cpNodeComparator, false);
            cpTrees_.set(loop, cpTree);
        }
        cpTree.insert(cpNode);
    }
    return cpTrees_;
}
export { createNewCpTrees };
//# sourceMappingURL=create-new-cp-trees.js.map