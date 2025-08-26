import { Loop } from "flo-boolean";
import { LlRbTree } from "flo-ll-rb-tree";
import { compareCps } from "../../contact-point/contact-point.js";
import { CpNode } from "../../cp-node/cp-node.js";
import { getAllOnLoop } from "../../cp-node/fs/get-all-on-loop.js";
import { getProngCount } from "../../cp-node/fs/get-prong-count.js";
import { isOrderCorrect } from "../../cp-node/fs/is-order-correct.js";


function checkOrdering(
        cpTrees: Map<Loop,LlRbTree<CpNode>>,
        cpStart: CpNode) {

    const cpNodes = getAllOnLoop(cpStart);

    const wrongsPerLoop: Map<Loop,[Order,Order][]> = new Map();
    for (const cpNodeA of cpNodes) {
        const cpNodeB = cpNodeA.next;

        const cpA = cpNodeA.cp;
        const posA = cpA.pointOnShape;
        const idxA = posA.curve.idx;
        const pA = posA.p;
        const loopA = posA.curve.loop;
        const cpTreeA = cpTrees.get(loopA)!;

        const cpB = cpNodeB.cp;
        const posB = cpB.pointOnShape;
        const idxB = posB.curve.idx;
        const pB = posB.p;
        // const loopB = posB.curve.loop;
        // const cpTreeB = cpTrees.get(loopB)!;
        
        const orderCorrect = isOrderCorrect(
            cpTreeA, cpA, cpNodeB
        )
        if (!orderCorrect) {
            const A: Order = {
                prongCount: getProngCount(cpNodeA),
                p: pA,
                cpNode: cpNodeA,
                curveIdx: idxA,
                t: cpA.pointOnShape.t,
                order: cpA.order,
                order2: cpA.order2
            }
            const B: Order = {
                prongCount: getProngCount(cpNodeB),
                p: pB,
                cpNode: cpNodeB,
                curveIdx: idxB,
                t: cpB.pointOnShape.t,
                order: cpB.order,
                order2: cpB.order2
            }
            const loopA = A.cpNode.cp.pointOnShape.curve.loop;
            let wrongs = wrongsPerLoop.get(loopA);
            if (wrongs === undefined) {
                wrongs = [];
                wrongsPerLoop.set(loopA, wrongs);
            }
            wrongs.push([A,B]);
        }
    }

    for (const [loop,wrongs] of wrongsPerLoop) {
        let maxOrder = Number.NEGATIVE_INFINITY;
        let max: Order | undefined = undefined;
        for (const wrong of wrongs) {
            const A = wrong[0];
            const B = wrong[1];
            const c = compareCps(A.cpNode.cp,B.cpNode.cp);
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
