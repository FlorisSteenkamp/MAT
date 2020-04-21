"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_ll_rb_tree_1 = require("flo-ll-rb-tree");
const cp_node_1 = require("../../cp-node");
/**
 * @hidden
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornerss
 */
function createInitialCpGraph(loops, cpTrees, sharpCornerss /*,
xMap: Map<number[][],{ ps: number[][] }>*/) {
    let cpNode;
    for (let k = 0; k < sharpCornerss.length; k++) {
        let sharpCorners = sharpCornerss[k];
        let cpTree = new flo_ll_rb_tree_1.default(cp_node_1.CpNode.comparator, [], true);
        let cpNode1 = undefined;
        let cpNode2 = undefined;
        for (let pos of sharpCorners) {
            let ps = pos.curve.next.ps;
            //let x = xMap.get(ps);
            //let isIntersection = !!x;
            let circle = { center: pos.p, radius: 0 };
            let cp1 = { pointOnShape: pos, circle, order: -1, order2: 0 };
            let cp2 = { pointOnShape: pos, circle, order: +1, order2: 0 };
            cpNode1 = cp_node_1.CpNode.insert(false, /*isIntersection*/ false, cpTree, cp1, cpNode2);
            cpNode2 = cp_node_1.CpNode.insert(false, /*isIntersection*/ false, cpTree, cp2, cpNode1);
            cpNode1.prevOnCircle = cpNode2;
            cpNode2.prevOnCircle = cpNode1;
            cpNode1.nextOnCircle = cpNode2;
            cpNode2.nextOnCircle = cpNode1;
        }
        if (!cpNode) {
            cpNode = cpNode1;
        }
        let loop = loops[k];
        cpTrees.set(loop, cpTree);
    }
    return cpNode;
}
exports.createInitialCpGraph = createInitialCpGraph;
//# sourceMappingURL=create-initial-cp-graph.js.map