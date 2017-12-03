"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_1 = require("../../mat/functions/traverse");
/**
 * The Medial Axis Transform. It is defined recursively as a rooted tree with
 * each node containing a point, a radius and 1, 2 or 3 branches.
 * @param node - A handle on the MAT tree structure.
 */
class MatTree {
    constructor(node) {
        this.startNode = node;
    }
}
MatTree.traverse = traverse_1.default;
exports.default = MatTree;
