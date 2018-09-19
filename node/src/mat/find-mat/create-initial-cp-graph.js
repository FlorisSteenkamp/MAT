"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const circle_1 = require("../../circle");
const cp_node_1 = require("../../cp-node");
const contact_point_1 = require("../../contact-point");
const flo_ll_rb_tree_1 = require("flo-ll-rb-tree");
/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornerss
 */
function createInitialCpGraph(loops, cpTrees, sharpCornerss) {
    let cpNode;
    for (let k = 0; k < sharpCornerss.length; k++) {
        let sharpCorners = sharpCornerss[k];
        let cpTree = new flo_ll_rb_tree_1.default(cp_node_1.CpNode.comparator, [], true);
        let cp1_ = undefined;
        let cp2_ = undefined;
        for (let pos of sharpCorners) {
            let circle = new circle_1.Circle(pos.p, 0);
            let cp1 = new contact_point_1.ContactPoint(pos, circle, -1, 0);
            let cp2 = new contact_point_1.ContactPoint(pos, circle, +1, 0);
            cp1_ = cp_node_1.CpNode.insert(false, cpTree, cp1, cp2_);
            cp2_ = cp_node_1.CpNode.insert(false, cpTree, cp2, cp1_);
            cp1_.prevOnCircle = cp2_;
            cp2_.prevOnCircle = cp1_;
            cp1_.nextOnCircle = cp2_;
            cp2_.nextOnCircle = cp1_;
        }
        if (!cpNode) {
            cpNode = cp1_;
        }
        let loop = loops[k];
        cpTrees.set(loop, cpTree);
    }
    return cpNode;
}
exports.createInitialCpGraph = createInitialCpGraph;
