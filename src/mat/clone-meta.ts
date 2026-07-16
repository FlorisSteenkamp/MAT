import type { MatMeta } from './mat-meta.js';
import type { CpNode } from '../cp-node/cp-node.js';
import { createNewCpTrees } from './create-new-cp-trees.js';


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
