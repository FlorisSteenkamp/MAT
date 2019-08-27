"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_ll_rb_tree_1 = require("flo-ll-rb-tree");
const cp_node_1 = require("../cp-node/cp-node");
function createNewCpTree(cpNode) {
    let newCpTrees = new Map();
    let cps = cpNode.getAllOnLoop();
    cps.forEach(f);
    function f(cpNode) {
        let loop = cpNode.cp.pointOnShape.curve.loop;
        let cpTree = newCpTrees.get(loop);
        if (!cpTree) {
            cpTree = new flo_ll_rb_tree_1.default(cp_node_1.CpNode.comparator, [], true);
            newCpTrees.set(loop, cpTree);
        }
        cpTree.insert(cpNode);
    }
    return newCpTrees;
}
exports.createNewCpTree = createNewCpTree;
//# sourceMappingURL=create-new-cp-tree.js.map