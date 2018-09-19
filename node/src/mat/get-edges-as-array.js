"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_edges_1 = require("./traverse-edges");
function getEdgesAsArray(cpNode) {
    let cpNodes = [];
    traverse_edges_1.traverseEdges(cpNode, function (cpNode) { cpNodes.push(cpNode); }, true);
    return cpNodes;
}
exports.getEdgesAsArray = getEdgesAsArray;
