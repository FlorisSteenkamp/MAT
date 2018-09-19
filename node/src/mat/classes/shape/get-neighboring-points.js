"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_node_1 = require("../../../linked-list/list-node");
const contact_point_1 = require("../../classes/contact-point");
/**
 * Returns the boundary piece that starts at the immediate previous point on
 * the shape and ends at the immediate next point.
 */
function getNeighbouringPoints(
    //shape: Shape, 
    cpGraph, pos, order, order2) {
    //let k = pos.bezierNode.loop.indx;
    //let cptree = shape.cpGraphs[k].cptree;
    let cptree = cpGraph.cptree;
    // TODO - ugly - improve code
    let cps = cptree.findBounds(new list_node_1.ListNode(undefined, new contact_point_1.ContactPoint(pos, undefined, order, order2), undefined, undefined, undefined));
    if (!cps[0] && !cps[1]) {
        // The tree is still empty
        return [undefined, undefined];
    }
    if (!cps[0] || !cps[1]) {
        // Smaller than all -> cptree.min() === cps[1].data OR
        // Larger than all -> cptree.max() === cps[0].data
        return [
            cptree.max(cptree.root),
            cptree.min(cptree.root)
        ];
    }
    return [
        cps[0].data,
        cps[1].data
    ];
}
exports.getNeighbouringPoints = getNeighbouringPoints;
