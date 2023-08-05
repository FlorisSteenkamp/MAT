import { CpNode, cpNodeComparator, getAllOnLoop } from "../cp-node/cp-node.js";
import { enhanceCpNode } from "../cp-node/enhance-cp-node.js";


/**
 * @internal
 * 
 * Use only for debugging. Check all nodes around the loop.
 */
function fixOrdering(
        cpNode: CpNode) {

    const cpStart = cpNode;

    /* holeCloser order causes an issue here
    {
        const cpNodes = getAllOnLoop(cpStart);

        cpNodes.sort(cpNodeComparator);
        // console.log(cpNodes.map(cpn => enhanceCpNode(cpn).ordering))

        const len = cpNodes.length;
        for (let i=0; i<len; i++) {
            const cpNode = cpNodes[i];
            const prev = cpNodes[(i + len - 1)%len];
            const next = cpNodes[(i + len + 1)%len];
            if (cpNode.prev !== prev) {
                // console.log(enhanceCpNode(cpNode));
            }
            if (cpNode.next !== next) {
                // console.log(enhanceCpNode(cpNode));
            }
            // cpNode.prev = prev;
            // cpNode.next = next;
        }
    }
    */

    /*
    {
        let cpNode2 = cpStart.next;
        while (cpNode2 !== cpStart) {
            const cpNode1 = cpNode2;
            cpNode2 = cpNode2.next;

            const c = cpNodeComparator(cpNode1, cpNode2)!;
            const looplen = cpNode1.cp.pointOnShape.curve.loop.beziers.length;
            if (c > 0 && !cpNode1.isHoleClosing && !cpNode2.isHoleClosing) {
                const o1 = cpNode1.cp.pointOnShape.curve.idx;
                const o2 = cpNode2.cp.pointOnShape.curve.idx;
                if (if) {
                   1;
                } else {
                    console.log('ORDER IS WRONG!', looplen, o1, o2)
                    console.log(c);
                    console.log(enhanceCpNode(cpNode1));
                    console.log(enhanceCpNode(cpNode2));
                    console.log('');
                }
            }
        }
	}
    */

	// return cpNodes;
}


export { fixOrdering }
