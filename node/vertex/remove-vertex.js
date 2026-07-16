import { getAllOnCircle } from '../cp-node/fs/get-all-on-circle.js';
import { getProngCount } from '../cp-node/fs/get-prong-count.js';
import { removeCpNode } from '../cp-node/fs/remove-cp-node.js';
/**
 * Removes a cpNode from the MAT.
 *
 * @param cpTree The tree graph holding the `CpNodes` of the MAT.
 * @param cpNode The `CpNode` to remove.
 */
function removeVertex(cpNode, meta) {
    const prongCount = getProngCount(cpNode);
    if (prongCount !== 2) {
        throw new Error(`Cannot delete \`CpNode\` on ${prongCount}-prong`);
    }
    getAllOnCircle(cpNode).forEach(cpNode => removeCpNode(cpNode, meta));
}
export { removeVertex };
//# sourceMappingURL=remove-vertex.js.map