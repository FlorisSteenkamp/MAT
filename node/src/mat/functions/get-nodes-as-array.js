"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_1 = require("../functions/traverse");
/**
 * Returns all the calculated MAT nodes as an array.
 */
function getNodesAsArray(mat) {
    let nodes = [];
    traverse_1.traverse(mat.startNode, function (node) {
        nodes.push(node);
    });
    return nodes;
}
exports.getNodesAsArray = getNodesAsArray;
