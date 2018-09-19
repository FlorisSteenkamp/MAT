"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_vertices_1 = require("../functions/traverse-vertices");
// TODO - change so it returns an array of CpNode instead of Circle
function getVerticesAsArray(cpNode) {
    let circles = [];
    traverse_vertices_1.traverseVertices(cpNode, circle => { circles.push(circle); });
    return circles;
}
exports.getVerticesAsArray = getVerticesAsArray;
