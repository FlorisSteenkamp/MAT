"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Representation of a node in the MAT structure.
 * @param matCircle
 * @param branches
 */
class MatNode {
    constructor(matCircle, branches) {
        this.matCircle = matCircle;
        this.branches = branches;
    }
    static copy(node) {
        return f(node);
        function f(matNode, priorNode, newPriorNode) {
            let branches = [];
            let newNode = new MatNode(matNode.matCircle, branches);
            for (let node of matNode.branches) {
                if (node === priorNode) {
                    // Don't go back in tracks.
                    branches.push(newPriorNode);
                    continue;
                }
                branches.push(f(node, matNode, newNode));
            }
            return newNode;
        }
    }
}
exports.default = MatNode;
