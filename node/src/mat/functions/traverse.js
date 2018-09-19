"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const branch_functions_1 = require("../functions/branch-functions");
/**
 * Traverses the MAT tree and calls a function on each node. This function must
 * have side effects to be useful.
 *
 * @param node
 */
function traverse(node, f) {
    //let visited = new Set<MatNode>();
    let visitedNodeMap = new Map();
    g(node);
    function g(matNode, prevNode, branchTaken) {
        f(matNode, prevNode, branchTaken);
        for (let branch of matNode.branches) {
            if (branch_functions_1.hasBranchBeenTaken(visitedNodeMap, matNode.matCircle, branch.matNode.matCircle)) {
                // We already visited this branch
                continue;
            }
            /*
            if (visited.has(branch.matNode)) {
                continue;
            }
            */
            /*
            if (branch.matNode === prevNode) {
                // Don't go back in tracks.
                continue;
            }
            */
            branch_functions_1.markBranchAsTaken(visitedNodeMap, matNode.matCircle, branch.matNode.matCircle);
            //visited.add(branch.matNode);
            g(branch.matNode, matNode, branch);
        }
    }
}
exports.traverse = traverse;
