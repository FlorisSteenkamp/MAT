"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_vertices_1 = require("./traverse-vertices");
function getVerticesAsArray(cpNode) {
    let cpNodes = [];
    traverse_vertices_1.traverseVertices(cpNode, cpNode => { cpNodes.push(cpNode); });
    return cpNodes;
}
exports.getVerticesAsArray = getVerticesAsArray;
