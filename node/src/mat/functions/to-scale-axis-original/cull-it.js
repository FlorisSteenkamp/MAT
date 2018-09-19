"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../classes/point-on-shape");
/**
 * Modifies cullNodes by adding nodes that potentially need to be called.
 * Returns true if a node should NOT be culled, false otherwise.
 */
function cullIt(cullHash, cullNodes, satNode, priorNode) {
    let key = point_on_shape_1.PointOnShape.makeSimpleKey(satNode.matCircle.circle.center);
    let anyNotCull = !cullHash[key];
    for (let node of satNode.branches) {
        if (node.matNode === priorNode) {
            continue;
        }
        if (cullIt(cullHash, cullNodes, node.matNode, satNode)) {
            anyNotCull = true;
        }
    }
    if (anyNotCull) {
        return true; // Don't cull me
    }
    cullNodes.push({ satCircle: satNode.matCircle, priorCircle: priorNode.matCircle });
    return false;
}
exports.cullIt = cullIt;
