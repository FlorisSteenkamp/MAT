"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_edges_1 = require("../traverse-edges");
function getLeaves(vertex) {
    let leaves = [];
    traverse_edges_1.traverseEdges(vertex, f, true);
    function f(cp, isLeaf) {
        if (isLeaf) {
            leaves.push(cp);
        }
    }
    return leaves;
}
exports.getLeaves = getLeaves;
