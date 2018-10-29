"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cp_node_1 = require("../cp-node");
const contact_point_1 = require("../contact-point");
/**
 * Returns the boundary piece that starts at the immediate previous point on the
 * shape and ends at the immediate next point.
 * @param cpTree
 * @param pos
 * @param order
 * @param order2
 */
function getNeighbouringPoints(cpTree, pos, order, order2) {
    let cps = cpTree.findBounds(new cp_node_1.CpNode(new contact_point_1.ContactPoint(pos, undefined, order, order2), false, false));
    if (!cps[0] && !cps[1]) {
        // The tree is still empty
        return [undefined, undefined];
    }
    if (!cps[0] || !cps[1]) {
        // Smaller than all -> cptree.min() === cps[1].data OR
        // Larger  than all -> cptree.max() === cps[0].data
        return [
            cpTree.max(cpTree.root),
            cpTree.min(cpTree.root)
        ];
    }
    return [
        cps[0].data,
        cps[1].data
    ];
}
exports.getNeighbouringPoints = getNeighbouringPoints;
//# sourceMappingURL=get-neighboring-cps.js.map