import { Loop } from 'flo-boolean';
import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from "../cp-node/cp-node.js";
import { getAllOnCircle } from '../cp-node/fs/get-all-on-circle.js';
import { getProngCount } from '../cp-node/fs/get-prong-count.js';
import { removeCpNode } from '../cp-node/fs/remove-cp-node.js';


function removeVertex(
        cpNode: CpNode,
        cpTrees: Map<Loop, LlRbTree<CpNode>>): void {

    const prongCount = getProngCount(cpNode);
    if (prongCount !== 2) {
        throw new Error(`Cannot delete \`CpNode\` on ${prongCount}-prong`)
    }

    getAllOnCircle(cpNode).forEach(cpNode => removeCpNode(cpNode, cpTrees));
}


export { removeVertex }
