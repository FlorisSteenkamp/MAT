import type { Loop } from 'flo-boolean';
import type { CpNode } from '../cp-node/cp-node.js';
import type { PointOnShape, PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { Mutable } from '../utils/mutable.js';
import { RbTree } from 'flo-ll-rb-tree';
import { insertCpNode } from '../cp-node/fs/insert-cp-node.js';
import { cpNodeComparator } from '../cp-node/fs/cp-node-comparator.js';


/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * 
 * * ❗Modifies❗`cpTrees` and `lastInsertId`
 * 
 * @param loops
 * @param cpTrees
 * @param sharpCornerss
 * @param lastInsertId
 * 
 * @internal
 */
function createInitialCpTree(
        loops: Loop[], 
        sharpCornerss: PrePointOnShape[][],
        lastInsertId: { id: number }) {

    const cpTrees: Map<Loop, RbTree<CpNode>> = new Map();

    for (let k=0; k<sharpCornerss.length; k++) {
        const cpTree = new RbTree(cpNodeComparator);
        cpTrees.set(loops[k], cpTree);

        const sharpCorners = sharpCornerss[k];

        let cpNode1: Mutable<CpNode> | undefined = undefined;
        let cpNode2: Mutable<CpNode> | undefined = undefined;
        for (const ppos of sharpCorners) {
            const circle = { center: ppos.p, radius: 0 };
            const { curve } = ppos;

            const pos1: PointOnShape = { ...ppos, curve,             t: 1, circle, order: -1, order2: 0 };
            const pos2: PointOnShape = { ...ppos, curve: curve.next, t: 0, circle, order: +1, order2: 0 };

            cpNode1 = insertCpNode(true, false, false, cpTree, pos1, cpNode2, lastInsertId)!;
            cpNode2 = insertCpNode(true, false, false, cpTree, pos2, cpNode1, lastInsertId)!;
            
            cpNode1.prevOnCircle = cpNode2;
            cpNode2.prevOnCircle = cpNode1;
            cpNode1.nextOnCircle = cpNode2;
            cpNode2.nextOnCircle = cpNode1;
        }
    }

    return cpTrees;
}


export { createInitialCpTree }
