"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses the MAT tree and calls a function on each node. This
 * function must have side effects to be useful.
 *
 * @param mat
 */
function traverse(mat, f) {
    g(mat.startNode);
    function g(matNode, priorNode) {
        f(matNode, priorNode);
        //for (let node of matNode.branches) {
        for (let i = 0; i < matNode.branches.length; i++) {
            let node = matNode.branches[i];
            if (node === priorNode) {
                // Don't go back in tracks.
                continue;
            }
            g(node, matNode);
        }
    }
}
exports.default = traverse;
