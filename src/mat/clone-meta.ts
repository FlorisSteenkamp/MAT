import type { MatMeta } from './mat-meta.js';
import type { CpNode } from '../cp-node/cp-node.js';
import { createNewCpTrees } from './create-new-cp-trees.js';


/**
 * Returns a clone of the given `MatMeta` for the given (already cloned)
 * `CpNode`, i.e. with `cpTrees` rebuilt from the clone and a fresh
 * `lastInsertId`.
 *
 * @param cpNode the (cloned) `CpNode` the meta is for
 * @param meta the `MatMeta` to clone
 */
function cloneMeta(
        cpNode: CpNode,
        meta: MatMeta): MatMeta {

    const {
        // pointToCpNode,
        lastInsertId,
        cpTrees,
        ...rest
    } = meta;

    const cpTrees_ = createNewCpTrees(cpNode);
    const lastInsertId_ = { id: lastInsertId.id };

    return {
        cpTrees: cpTrees_,
        lastInsertId: lastInsertId_,
        // pointToCpNode,
        ...rest
    }
}


export { cloneMeta }
