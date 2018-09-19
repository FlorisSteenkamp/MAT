"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses the MAT tree and calls a function on each node. This function must
 * have side effects to be useful.
 *
 * Use traverseBranches to traverse the branches instead.
 * @param matCircle
 */
function traverseMatCircles(matCircle, f) {
    let visited = new Set();
    g(matCircle);
    function g(matCircle) {
        if (!matCircle.deleted) {
            f(matCircle);
        }
        for (let edge of matCircle.edges) {
            if (visited.has(edge.toMatCircle)) {
                continue; // We already visited this branch.
            }
            visited.add(edge.toMatCircle);
            g(edge.toMatCircle);
        }
    }
}
exports.traverseMatCircles = traverseMatCircles;
