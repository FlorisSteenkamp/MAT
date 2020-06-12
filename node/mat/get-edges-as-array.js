"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEdgesAsArray = void 0;
const traverse_edges_1 = require("../traverse-edges");
/** @hidden */
function getEdgesAsArray(cpNode) {
    let cpNodes = [];
    traverse_edges_1.traverseEdges(cpNode, function (cpNode) { cpNodes.push(cpNode); });
    return cpNodes;
}
exports.getEdgesAsArray = getEdgesAsArray;
//# sourceMappingURL=get-edges-as-array.js.map