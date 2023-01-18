import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from '../../cp-node.js';
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
        const sharpCorners = sharpCornerss[k];
        // qqq const cpTree = new LlRbTree(CpNode.comparator, [], true);
        const cpTree = new LlRbTree(CpNode.comparator, false);
        let cpNode1 = undefined;
        let cpNode2 = undefined;
        for (const pos of sharpCorners) {
            const ps = pos.curve.next.ps;
            //const x = xMap.get(ps);
            //const isIntersection = !!x;
            const circle = { center: pos.p, radius: 0 };
            const cp1 = { pointOnShape: pos, circle, order: -1, order2: 0 };
            const cp2 = { pointOnShape: pos, circle, order: +1, order2: 0 };
            cpNode1 = CpNode.insert(false, /*isIntersection*/ false, cpTree, cp1, cpNode2);
            cpNode2 = CpNode.insert(false, /*isIntersection*/ false, cpTree, cp2, cpNode1);
            cpNode1.prevOnCircle = cpNode2;
            cpNode2.prevOnCircle = cpNode1;
            cpNode1.nextOnCircle = cpNode2;
            cpNode2.nextOnCircle = cpNode1;
        }
        if (!cpNode) {
            cpNode = cpNode1;
        }
        const loop = loops[k];
        cpTrees.set(loop, cpTree);
    }
    return cpNode;
}
export { createInitialCpGraph };
//# sourceMappingURL=create-initial-cp-graph.js.map