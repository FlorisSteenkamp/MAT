"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_node_1 = require("../../mat/classes/mat-node");
const mat_tree_1 = require("../classes/mat-tree");
function copyMat(matTree) {
    return new mat_tree_1.default(mat_node_1.default.copy(matTree.startNode));
}
exports.default = copyMat;
