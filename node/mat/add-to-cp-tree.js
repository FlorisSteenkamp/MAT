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
function addToCpTree(insertIfOrderIsWrong, isHoleClosing, circle, orders, cpTrees, poss, neighbors) {
    let anyFailed = false;
    const cpNodes = poss.map((pos, i) => {
        const order = orders[i];
        const cpTree = cpTrees.get(pos.curve.loop);
        const cp = { pointOnShape: pos, circle, order, order2: 0 };
        const pred = neighbors === undefined
            ? getCpNodeToLeftOrSame(cpTree, pos, order, 0)
            : neighbors[i];
        const cpNode = insertCpNode(insertIfOrderIsWrong, isHoleClosing, false, cpTree, cp, pred);
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