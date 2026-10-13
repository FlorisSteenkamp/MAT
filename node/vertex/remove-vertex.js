import { getAllOnCircle } from '../cp-node/fs/get-all-on-circle.js';
import { getProngCount } from '../cp-node/fs/get-prong-count.js';
import { removeCpNode } from '../cp-node/fs/remove-cp-node.js';
/**
 * Removes the (2-prong) vertex represented by the given `CpNode` from the MAT,
 * i.e. both `CpNode`s on its circle are unlinked from the boundary and removed
 * from `meta.cpTrees`.
 *
 * @param cpNode a `CpNode` on the vertex to remove
 * @param meta the `MatMeta` whose `cpTrees` hold the `CpNode`s of the MAT
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