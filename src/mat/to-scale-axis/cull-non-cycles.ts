import { getLeaves } from '../get-leaves.js';
import { CpNode, getProngCount, isOnSameCircle, isTerminating } from '../../cp-node/cp-node.js';


/**
 * @internal
 * Cull all edges not part of a cycle in the MAT planar graph.
 * @param cpStart The start CpNode which must reprsesent the maximal 3-prong 
 * vertex.
 */
function cullNonCycles(cpStart: CpNode) {

    let cpNodeKept = cpStart;

    const leaves = getLeaves(cpStart);

    
    while (leaves.length) {
        const leaf = leaves.pop()!;

        // Preserve topology - keep cycles.
        if (leaf.isHoleClosing || leaf.isIntersection) { continue; }

        let cpNode = leaf.next; // Turn around

        while (true) {
            cpNode = cpNode.next;
            let cut = false;
            const cp1 = cpNode.prevOnCircle;

            if (getProngCount(cpNode) > 2) {
                //const cp2 = cp1.prevOnCircle;
                const cp2 = cpNode.nextOnCircle;

                //if (cpStart === cpNode || cpStart === cp1 || cpStart === cp2) {
                if (isOnSameCircle(cpNode, cpStart)) {
                    cut = true; // We are at the max disk - cut whole edge
                } else if (cpNode.next === cp2) {
                    cpNode = cp2;
                } else if (cp2.next !== cp1) {
                    cut = true; // Cut whole edge
                }
            } else if (isTerminating(cpNode) && !cpNode.isIntersection) {
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


export { cullNonCycles }
