"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses the MAT tree and finds a node with a specified property.
 * @param mat
 * @param f A function that takes the current and the prior node and should
 * return true if the node is found or falsy otherwise.
 */
function findNode(mat, f) {
    return g(mat, undefined);
    function g(vertex, priorCircle) {
        if (f(vertex, priorCircle)) {
            return vertex;
        }
        ;
        for (let edge of vertex.edges) {
            if (edge.toVertex === priorCircle) {
                continue; // Don't go back in tracks.
            }
            return g(edge.toVertex, vertex);
        }
    }
}
exports.findNode = findNode;
