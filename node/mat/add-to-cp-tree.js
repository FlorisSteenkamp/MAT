import { getCpNodeNeighbors } from './get-cp-node-neighbors.js';
import { insertCpNode } from '../cp-node/fs/insert-cp-node.js';
import { joinSpokes } from '../add-n-prong.ts/join-spokes.js';
/**
 * Insert the given `poss` into the `cpTree` (within `meta`) and returns the
 * newly inserted `CpNode`s.
 *
 * @param circle
 * @param orders
 * @param cpTrees
 * @param poss
 * @param neighbors
 *
 * @internal
 */
function addToCpTree(insertIfOrderIsWrong, isHoleClosing, circle, orders, meta, poss, neighbors) {
    const { cpTrees } = meta;
    let anyFailed = false;
    const cpNodes = poss.map((ppos, i) => {
        const order = orders[i];
        const cpTree = cpTrees.get(ppos.curve.loop);
        const pos = { ...ppos, circle, order, order2: 0 };
        const r = neighbors === undefined
            ? getCpNodeNeighbors(cpTree, ppos, order, 0)
            : neighbors[i];
        const pred = r?.[0];
        const succ = r?.[1];
        const cpNode = insertCpNode(insertIfOrderIsWrong, isHoleClosing, false, cpTree, pos, pred, 
        // pred?.next,
        succ, meta.lastInsertId);
        if (cpNode === undefined) {
            anyFailed = true;
        }
        return cpNode;
    });
    if (!anyFailed) {
        joinSpokes(circle, cpNodes);
    }
    return { anyFailed, cpNodes };
}
export { addToCpTree };
//# sourceMappingURL=add-to-cp-tree.js.map