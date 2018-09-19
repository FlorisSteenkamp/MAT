"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_ll_rb_tree_1 = require("flo-ll-rb-tree");
const cp_node_1 = require("../../cp-node");
const traverse_edges_1 = require("../traverse-edges");
function createNewCpTree(cpNode) {
    let newCpTrees = new Map();
    traverse_edges_1.traverseEdges(cpNode, function (cpNode) {
        let loop = cpNode.cp.pointOnShape.curve.loop;
        let cpTree = newCpTrees.get(loop);
        if (!cpTree) {
            cpTree = new flo_ll_rb_tree_1.default(cp_node_1.CpNode.comparator, [], true);
            newCpTrees.set(loop, cpTree);
        }
        cpTree.insert(cpNode);
    });
    return newCpTrees;
}
exports.createNewCpTree = createNewCpTree;
