import type { Loop } from 'flo-boolean';
import type { CpNode } from '../cp-node/cp-node.js';
import { RbTree } from 'flo-ll-rb-tree';
import { cpNodeComparator } from '../cp-node/fs/cp-node-comparator.js';
import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';



/**
 * @param cpNode 
 * 
 * @internal
 */
function createNewCpTrees(
        cpNode: CpNode) {

    const cpTrees_: Map<Loop,RbTree<CpNode>> = new Map();

    getAllOnLoop(cpNode).forEach(createNewCpTree_);

    function createNewCpTree_(cpNode: CpNode) {
        const loop = cpNode.pointOnShape.curve.loop;
        let cpTree = cpTrees_.get(loop);
        if (!cpTree) { 
            cpTree = new RbTree(cpNodeComparator); 
            cpTrees_.set(loop, cpTree);
        }
        cpTree.insert(cpNode);
    }

    return cpTrees_;
}


export { createNewCpTrees }
