"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_1 = require("./traverse");
/**
 * Returns all the calculated MAT nodes as an array.
 */
function getNodesAsArray(mat) {
    let nodes = [];
    traverse_1.default(mat, function (node) {
        nodes.push(node);
    });
    return nodes;
}
exports.default = getNodesAsArray;
