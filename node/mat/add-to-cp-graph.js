import { CpNode } from '../cp-node.js';
import { getNeighbouringPoints } from './get-neighboring-cps.js';
/**
 * @hidden
 * @param circle
 * @param orders
 * @param cpTrees
 * @param poss
 * @param neighbors
 * @hidden
 */
function addToCpGraph(circle, orders, cpTrees, poss, neighbors) {
    let newCps = poss.map((pos, i) => {
        let cpTree = cpTrees.get(pos.curve.loop);
        let newCp_ = { pointOnShape: pos, circle, order: orders[i], order2: 0 };
        let neighboringCp = neighbors
            ? neighbors[i]
            : getNeighbouringPoints(cpTree, pos, orders[i], 0);
        let newCp = CpNode.insert(false, false, cpTree, newCp_, neighboringCp[0]);
        return newCp;
    });
    let len = poss.length;
    for (let i = 0; i < len; i++) {
        let indxPrev = i === 0 ? len - 1 : i - 1;
        let indxNext = i === len - 1 ? 0 : i + 1;
        newCps[i].prevOnCircle = newCps[indxPrev];
        newCps[i].nextOnCircle = newCps[indxNext];
    }
}
export { addToCpGraph };
//# sourceMappingURL=add-to-cp-graph.js.map