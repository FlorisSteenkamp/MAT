"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_edges_1 = require("./traverse-edges");
function getLeaves(cpNode) {
    let leaves = [];
    traverse_edges_1.traverseEdges(cpNode, f, true);
    function f(cp, isLeaf) {
        if (isLeaf) {
            leaves.push(cp);
        }
    }
    return leaves;
}
exports.getLeaves = getLeaves;
