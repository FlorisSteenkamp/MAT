"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const circle_1 = require("../../classes/circle");
const cp_graph_1 = require("../../../linked-list/cp-graph");
const contact_point_1 = require("../../classes/contact-point");
/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornerss
 */
function createInitialCpGraph(loops, sharpCornerss) {
    let cpGraphs = new Map();
    for (let k = 0; k < sharpCornerss.length; k++) {
        let sharpCorners = sharpCornerss[k];
        let cpGraph = new cp_graph_1.CpGraph([]);
        let cp1_ = undefined;
        let cp2_ = undefined;
        for (let pos of sharpCorners) {
            let circle = new circle_1.Circle(pos.p, 0);
            let cp1 = new contact_point_1.ContactPoint(pos, circle, -1, 0);
            let cp2 = new contact_point_1.ContactPoint(pos, circle, +1, 0);
            cp1_ = cpGraph.insert(cp1, cp2_);
            cp2_ = cpGraph.insert(cp2, cp1_);
            cp1_.prevOnCircle = cp2_;
            cp2_.prevOnCircle = cp1_;
            cp1_.nextOnCircle = cp2_;
            cp2_.nextOnCircle = cp1_;
        }
        let loop = loops[k];
        cpGraphs.set(loop, cpGraph);
    }
    return cpGraphs;
}
exports.createInitialCpGraph = createInitialCpGraph;
