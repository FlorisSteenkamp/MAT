"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses the MAT tree and finds a node with a specified property.
 *
 * @param mat
 * @param {boolean Function({MatNode},{MatNode})} A function that takes
 *        the current and the prior node and should return true if the
 *        node is found or falsy otherwise.
 * @returns {MatNode} The found node or undefined otherwise.
 */
function findNode(mat, f) {
    return g(mat.startNode, undefined);
    function g(matNode, priorNode) {
        if (f(matNode, priorNode)) {
            return matNode;
        }
        ;
        for (let node of matNode.branches) {
            if (node === priorNode) {
                // Don't go back in tracks.
                continue;
            }
            return g(node, matNode);
        }
    }
}
exports.default = findNode;
