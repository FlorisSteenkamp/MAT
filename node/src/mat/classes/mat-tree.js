"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_nodes_1 = require("../functions/traverse-nodes");
const traverse_branches_1 = require("../functions/traverse-branches");
const get_mat_nodes_as_array_1 = require("../functions/get-mat-nodes-as-array");
/**
 * The Medial Axis Transform. It is defined recursively as a rooted tree with
 * each node containing a point, a radius and 1, 2 or 3 branches.
 * @param node - A handle on the MAT tree structure.
 */
class MatTree {
    constructor(startNode, startCircle) {
        /* Not going to work - not all MATs have 3-prongs
        if (startNode.branches.length !== 3) {
            throw new Error('Start node must be a 3-prong since 2-prongs may be deleted.')
        }
        */
        this.startNode = startNode;
        this.startCircle = startCircle;
    }
}
MatTree.traverseNodes = traverse_nodes_1.traverseNodes;
MatTree.traverseBranches = traverse_branches_1.traverseBranches;
MatTree.getMatNodesAsArray = get_mat_nodes_as_array_1.getMatNodesAsArray;
exports.MatTree = MatTree;
