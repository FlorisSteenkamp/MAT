"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_leaves_1 = require("../get-leaves");
/**
 * Cull all edges not part of a cycle in the MAT planar graph.
 * @param cpStart The start CpNode which must reprsesent the maximal 3-prong
 * vertex.
 */
function cullNonCycles(cpStart) {
    let cpNodeKept = cpStart;
    let leaves = get_leaves_1.getLeaves(cpStart);
    while (leaves.length) {
        let leaf = leaves.pop();
        // Preserve topology - keep cycles.
        if (leaf.isHoleClosing || leaf.isIntersection) {
            continue;
        }
        let cpNode = leaf.next; // Turn around
        while (true) {
            cpNode = cpNode.next;
            let cut = false;
            let cp1 = cpNode.prevOnCircle;
            if (cpNode.isThreeProng()) {
                let cp2 = cp1.prevOnCircle;
                if (cpStart === cpNode || cpStart === cp1 || cpStart === cp2) {
                    cut = true; // We are at the max disk - cut whole edge
                }
                else if (cpNode.next === cp2) {
                    cpNode = cp2;
                }
                else if (cp2.next !== cp1) {
                    cut = true; // Cut whole edge
                }
            }
            else if (cpNode.isTerminating() && !cpNode.isIntersection) {
                cpNodeKept = cpNode;
                return undefined;
            }
            if (cut) {
                cp1.next = cpNode;
                cpNode.prev = cp1;
                cpNodeKept = cpNode;
                break;
            }
        }
    }
    return cpNodeKept;
}
exports.cullNonCycles = cullNonCycles;
