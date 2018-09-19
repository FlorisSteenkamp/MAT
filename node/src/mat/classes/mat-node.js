"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const edge_1 = require("../classes/edge");
/**
 * Representation of a node in the MAT structure.
 * @param matCircle
 * @param branches
 */
class MatNode {
    constructor(matCircle, branches) {
        this.deleted = false;
        this.matCircle = matCircle;
        this.branches = branches;
    }
    static copy(node) {
        return f(node);
        function f(matNode, priorNode, newPriorNode) {
            let newBranches = [];
            let newNode = new MatNode(matNode.matCircle, newBranches);
            for (let branch of matNode.branches) {
                if (branch.toMatCircle.matNode === priorNode) {
                    // Don't go back in tracks.
                    let newBranch = new edge_1.Edge(branch.fromCp, branch.toCp);
                    newBranches.push(newBranch);
                    continue;
                }
                let newMatNode = f(branch.toMatCircle.matNode, matNode, newNode);
                let newBranch = new edge_1.Edge(branch.fromCp, branch.toCp);
                newBranches.push(newBranch);
            }
            return newNode;
        }
    }
}
exports.MatNode = MatNode;
