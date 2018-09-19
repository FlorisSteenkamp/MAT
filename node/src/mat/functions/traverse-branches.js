"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const branch_functions_1 = require("../functions/branch-functions");
/**
 * Traverses the MAT tree and calls a function on each branch. This function
 * must have side effects to be useful.
 *
 * Use traverseNodes to traverse the nodes instead.
 * @param node
 */
function traverseBranches(node, f) {
    let branchMap = new Map();
    g(node);
    function g(matCircle, prevNode, branchTaken) {
        f(matCircle, prevNode, branchTaken);
        for (let branch of matCircle.branches) {
            if (branch_functions_1.hasBranchBeenTaken(branchMap, matCircle, branch.toMatCircle)) {
                continue; // We already visited this branch.
            }
            branch_functions_1.markBranchAsTaken(branchMap, matCircle, branch.toMatCircle);
            g(branch.toMatCircle, matCircle, branch);
        }
    }
}
exports.traverseBranches = traverseBranches;
