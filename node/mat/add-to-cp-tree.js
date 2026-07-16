import { getCpNodeToLeftOrSame } from './get-cp-node-to-left-or-same.js';
import { insertCpNode } from '../cp-node/fs/insert-cp-node.js';
import { joinSpokes } from '../add-n-prong.ts/join-spokes.js';
/**
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
        const pred = neighbors === undefined
            ? getCpNodeToLeftOrSame(cpTree, ppos, order, 0)
            : neighbors[i];
        const cpNode = insertCpNode(insertIfOrderIsWrong, isHoleClosing, false, cpTree, pos, pred, meta.lastInsertId);
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