"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_node_1 = require("../classes/mat-node");
const mat_tree_1 = require("../classes/mat-tree");
function copyMat(matTree) {
    return new mat_tree_1.MatTree(mat_node_1.MatNode.copy(matTree.startNode), undefined);
}
exports.copyMat = copyMat;
