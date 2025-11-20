import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNodeFs } from '../cp-node/cp-node-fs.js';
import { insertCpNode } from '../cp-node/fs/insert-cp-node.js';
const { cpNodeComparator } = CpNodeFs;
/**
 * @internal
 * Creates the initial ContactPoint loops from the given sharp corners.
 *
 * * modifies `cpTrees`
 *
 * @param shape
 * @param sharpCornerss
 */
function createInitialCpTree(loops, cpTrees, sharpCornerss) {
    let cpNode;
    for (let k = 0; k < sharpCornerss.length; k++) {
        const sharpCorners = sharpCornerss[k];
        const cpTree = new LlRbTree(cpNodeComparator, false);
        let cpNode1 = undefined;
        let cpNode2 = undefined;
        for (const pos of sharpCorners) {
            const circle = { center: pos.p, radius: 0 };
            const cp1 = { pointOnShape: pos, circle, order: -1, order2: 0 };
            const cp2 = { pointOnShape: pos, circle, order: +1, order2: 0 };
            cpNode1 = insertCpNode(true, false, false, cpTree, cp1, cpNode2);
            cpNode2 = insertCpNode(true, false, false, cpTree, cp2, cpNode1);
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
export { createInitialCpTree };
//# sourceMappingURL=create-initial-cp-tree.js.map