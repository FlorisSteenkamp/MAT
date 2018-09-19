"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBiggestVertex(vertices) {
    let biggest = -Number.POSITIVE_INFINITY;
    let biggestVertex = undefined;
    for (let vertex of vertices) {
        let r = vertex.circle.radius;
        if (r > biggest) {
            biggestVertex = vertex;
            biggest = r;
        }
    }
    return biggestVertex;
}
exports.getBiggestVertex = getBiggestVertex;
