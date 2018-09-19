"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const circle_1 = require("../../classes/circle");
const vertex_1 = require("../../classes/vertex/vertex");
const linked_loop_1 = require("../../../linked-list/linked-loop");
const contact_point_1 = require("../../classes/contact-point");
/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornersArray
 */
function createInitialCpGraph(sharpCornersArray) {
    let cpLoops = [];
    let comparator = (a, b) => contact_point_1.ContactPoint.compare(a.item, b.item);
    for (let k = 0; k < sharpCornersArray.length; k++) {
        let sharpCorners = sharpCornersArray[k];
        let cpLoop = new linked_loop_1.LinkedLoop([], comparator, k);
        let cp1_ = undefined;
        let cp2_ = undefined;
        for (let pos of sharpCorners) {
            let cp1 = new contact_point_1.ContactPoint(pos, undefined, -1, 0);
            let cp2 = new contact_point_1.ContactPoint(pos, undefined, +1, 0);
            cp1_ = cpLoop.insert(cp1, cp2_);
            cp2_ = cpLoop.insert(cp2, cp1_);
            cp1_.prevOnCircle = cp2_;
            cp2_.prevOnCircle = cp1_;
            cp1_.nextOnCircle = cp2_;
            cp2_.nextOnCircle = cp1_;
            vertex_1.Vertex.create(new circle_1.Circle(pos.p, 0), [cp1_, cp2_]);
            //addCpToBezierCpSet(shape, k, cp1);
            //addCpToBezierCpSet(shape, k, cp2);
        }
        cpLoops.push(cpLoop);
    }
    return cpLoops;
}
exports.createInitialCpGraph = createInitialCpGraph;
