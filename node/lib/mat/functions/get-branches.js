"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const find_node_1 = require("./find-node");
/**
 * Get the branches from the given MAT.
 *
 * @param mat
 */
function getBranches(mat) {
    // Start at a node with 1 or 3 branches.
    let startNode = find_node_1.default(mat, function (node) {
        return node.branches.length !== 2;
    });
    let branchCount = 0;
    g(startNode, undefined, 0);
    //console.log(branchCount);
    function g(matNode, priorNode, depth) {
        for (let i = 0; i < matNode.branches.length; i++) {
            let node = matNode.branches[i];
            if (node === priorNode) {
                // Don't go back in tracks.
                continue;
            }
            branchCount++;
            let branch = traverseSingleBranch(matNode, i);
            //console.log(branch);
            for (let node of branch) {
                let color = ['red', 'blue', 'green'][i];
                /*
                if (typeof FloMat !== 'undefined' && FloMat._debug_ && !FloMat._debug_.config.isTiming) {
                    FloMat._debug_.draw.dot(node.matCircle.circle.center, 1, color);
                }
                */
            }
            let endNode = branch[branch.length - 1];
            let prevNode = branch[branch.length - 2];
            /*
            if (typeof FloMat !== 'undefined' && FloMat._debug_ && !FloMat._debug_.config.isTiming) {
                FloMat._debug_.draw.dot(endNode.matCircle.circle.center, 2, 'yellow');
            }
            */
            g(endNode, prevNode, depth + 1);
        }
    }
}
/**
 * Traverses from the given node which should be a 3 or 1 prong to
 * the next 3 or 1 prong in the direction of the given branch index.
 */
function traverseSingleBranch(matNode, branchIndx) {
    let branch = [matNode];
    g(matNode.branches[branchIndx], matNode);
    return branch;
    function g(matNode, priorNode) {
        branch.push(matNode);
        if (matNode.branches.length !== 2) {
            return;
        }
        for (let node of matNode.branches) {
            if (node === priorNode) {
                // Don't go back in tracks.
                continue;
            }
            g(node, matNode);
        }
    }
}
exports.default = getBranches;
