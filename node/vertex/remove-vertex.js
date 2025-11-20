import { getAllOnCircle } from '../cp-node/fs/get-all-on-circle.js';
import { getProngCount } from '../cp-node/fs/get-prong-count.js';
import { removeCpNode } from '../cp-node/fs/remove-cp-node.js';
function removeVertex(cpNode, cpTrees) {
    const prongCount = getProngCount(cpNode);
    if (prongCount !== 2) {
        throw new Error(`Cannot delete \`CpNode\` on ${prongCount}-prong`);
    }
    getAllOnCircle(cpNode).forEach(cpNode => removeCpNode(cpNode, cpTrees));
}
export { removeVertex };
//# sourceMappingURL=remove-vertex.js.map