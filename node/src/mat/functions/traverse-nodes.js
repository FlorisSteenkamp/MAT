"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses the MAT tree and calls a function on each node. This function must
 * have side effects to be useful.
 *
 * Use traverseBranches to traverse the branches instead.
 * @param mat
 */
function traverseNodes(mat, f) {
    let visitedNodes = new Set();
    g(mat);
    function g(mat) {
        if (!mat.deleted) {
            f(mat);
        }
        for (let branch of mat.branches) {
            if (visitedNodes.has(branch.toMatCircle)) {
                continue; // We already visited this branch.
            }
            visitedNodes.add(branch.toMatCircle);
            g(branch.toMatCircle);
        }
    }
}
exports.traverseNodes = traverseNodes;
