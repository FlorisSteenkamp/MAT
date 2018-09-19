"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_nodes_1 = require("../functions/traverse-nodes");
/**
 * Returns all the calculated MAT nodes as an array.
 */
// TODO - memoize
function getMatNodesAsArray(mat) {
    let nodes = [];
    traverse_nodes_1.traverseNodes(mat, function (node) {
        nodes.push(node);
    });
    return nodes;
}
exports.getMatNodesAsArray = getMatNodesAsArray;
