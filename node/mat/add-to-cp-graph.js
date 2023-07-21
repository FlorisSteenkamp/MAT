import { insertCpNode } from '../cp-node/cp-node.js';
import { getNeighbouringPoints } from './get-neighboring-cps.js';
/**
 * @internal
 *
 * @param circle
 * @param orders
 * @param cpTrees
 * @param poss
 * @param neighbors
 * @internal
 */
function addToCpGraph(circle, orders, cpTrees, poss, neighbors) {
    const newCps = poss.map((pos, i) => {
        const cpTree = cpTrees.get(pos.curve.loop);
        const newCp_ = { pointOnShape: pos, circle, order: orders[i], order2: 0 };
        const neighboringCp = neighbors
            ? neighbors[i]
            : getNeighbouringPoints(cpTree, pos, orders[i], 0);
        const newCp = insertCpNode(false, false, cpTree, newCp_, neighboringCp[0]);
        return newCp;
    });
    const len = poss.length;
    for (let i = 0; i < len; i++) {
        const indxPrev = i === 0 ? len - 1 : i - 1;
        const indxNext = i === len - 1 ? 0 : i + 1;
        newCps[i].prevOnCircle = newCps[indxPrev];
        newCps[i].nextOnCircle = newCps[indxNext];
    }
    return newCps;
}
export { addToCpGraph };
//# sourceMappingURL=add-to-cp-graph.js.map