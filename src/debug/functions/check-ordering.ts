import type { Loop } from "flo-boolean";
import type { MatMeta } from "../../mat/mat-meta.js";
import { CpNode } from "../../cp-node/cp-node.js";
import { getAllOnLoop } from "../../cp-node/fs/get-all-on-loop.js";
import { getProngCount } from "../../cp-node/fs/get-prong-count.js";
import { isOrderCorrect } from "../../cp-node/fs/is-order-correct.js";
import { comparePoss } from "../../point-on-shape/compare-poss.js";


function checkOrdering(
        meta: MatMeta,
        cpStart: CpNode) {

    const { cpTrees } = meta;

    const cpNodes = getAllOnLoop(cpStart);

    const wrongsPerLoop: Map<Loop,[Order,Order][]> = new Map();
    for (const cpNodeA of cpNodes) {
        const cpNodeB = cpNodeA.next;

        const posA = cpNodeA.pointOnShape;
        const idxA = posA.curve.idx;
        const pA = posA.p;
        const loopA = posA.curve.loop;
        const cpTreeA = cpTrees.get(loopA)!;

        const posB = cpNodeB.pointOnShape;
        const idxB = posB.curve.idx;
        const pB = posB.p;
        // const loopB = posB.curve.loop;
        // const cpTreeB = cpTrees.get(loopB)!;
        
        const orderCorrect = isOrderCorrect(
            cpTreeA, posA, cpNodeB
        )
        if (!orderCorrect) {
            const A: Order = {
                prongCount: getProngCount(cpNodeA),
                p: pA,
                cpNode: cpNodeA,
                curveIdx: idxA,
                t: posA.t,
                order: posA.order,
                order2: posA.order2
            }
            const B: Order = {
                prongCount: getProngCount(cpNodeB),
                p: pB,
                cpNode: cpNodeB,
                curveIdx: idxB,
                t: posB.t,
                order: posB.order,
                order2: posB.order2
            }
            const loopA = A.cpNode.pointOnShape.curve.loop;
            let wrongs = wrongsPerLoop.get(loopA);
            if (wrongs === undefined) {
                wrongs = [];
                wrongsPerLoop.set(loopA, wrongs);
            }
            wrongs.push([A,B]);
        }
    }

    for (const [loop,wrongs] of wrongsPerLoop) {
        let maxOrder = -Infinity;
        let max: Order | undefined = undefined;
        for (const wrong of wrongs) {
            const A = wrong[0];
            const B = wrong[1];
            const c = comparePoss(A.cpNode.pointOnShape, B.cpNode.pointOnShape);
            if (c > maxOrder) { 
                
            }
            // console.log(wrong[0]);
            // console.log(wrong[1]);
            // console.log('---------');
        }
    }
    // }
}


interface Order {
    prongCount: number;
    cpNode: CpNode;
    p: number[];
    /** From highest to lowest significance */
    curveIdx: number;
    t: number;
    order: number;
    order2: number;
}


export { checkOrdering }
