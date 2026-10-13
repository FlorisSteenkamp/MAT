import { createNewCpTrees } from './create-new-cp-trees.js';
/**
 * Returns a clone of the given `MatMeta` for the given (already cloned)
 * `CpNode`, i.e. with `cpTrees` rebuilt from the clone and a fresh
 * `lastInsertId`.
 *
 * @param cpNode the (cloned) `CpNode` the meta is for
 * @param meta the `MatMeta` to clone
 */
function cloneMeta(cpNode, meta) {
    const { 
    // pointToCpNode,
    lastInsertId, cpTrees, ...rest } = meta;
    const cpTrees_ = createNewCpTrees(cpNode);
    const lastInsertId_ = { id: lastInsertId.id };
    return {
        cpTrees: cpTrees_,
        lastInsertId: lastInsertId_,
        // pointToCpNode,
        ...rest
    };
}
export { cloneMeta };
//# sourceMappingURL=clone-meta.js.map