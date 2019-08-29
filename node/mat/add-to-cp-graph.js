"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_point_1 = require("../contact-point");
const cp_node_1 = require("../cp-node/cp-node");
const get_neighboring_cps_1 = require("./get-neighboring-cps");
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
        let newCp_ = new contact_point_1.ContactPoint(pos, circle, orders[i], 0);
        let neighboringCp = neighbors
            ? neighbors[i]
            : get_neighboring_cps_1.getNeighbouringPoints(cpTree, pos, orders[i], 0);
        let newCp = cp_node_1.CpNode.insert(false, false, cpTree, newCp_, neighboringCp[0]);
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
exports.addToCpGraph = addToCpGraph;
//# sourceMappingURL=add-to-cp-graph.js.map