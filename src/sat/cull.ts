import { Circle } from '../geometry/circle.js';
import { getLeaves } from './get-leaves.js';
import { CpNode } from '../cp-node/cp-node.js';
import { CpNodeFs } from '../cp-node/cp-node-fs.js';
import { isTerminating } from '../cp-node/fs/is-terminating.js';
import { DualSet, DualSetFs } from '../utils/dual-set.js';

const { isOnSameCircle } = CpNodeFs;


/**
 * 
 * @param cpStart 
 */
function getNonTrivialForwardEdges(cpStart: CpNode) {
    let cpNode = cpStart;
    let cpEnd = cpStart.prevOnCircle;
    while (isTerminating(cpEnd)) {
        cpEnd = cpEnd.prevOnCircle;
    }
    
    const cps: CpNode[] = [];
    do {
        if (!isTerminating(cpNode)) {
            cps.push(cpNode);
        }
        cpNode = cpNode.nextOnCircle;
    } while (cpNode !== cpEnd)

    return cps;
}


/**
 * @internal
 * Returns the set of Vertices passing the following test: walk the MAT tree and 
 * keep all Vertices not in the current cull set and any Vertices that have a 
 * non-culled node further down the line toward the tree leaves.
 * @param culls The CpNodes (referred to by circles) that should be culled.
 * @param maxCpNode The start CpNode which must reprsesent the maximal vertex.
 */
function cull(
        culls: DualSet<number, number>,
        maxCpNode: CpNode) {

    const leaves = getLeaves(maxCpNode);

    while (leaves.length) {
        const leaf = leaves.pop()!;

        const { center: c } = leaf.cp.circle;
        if (!DualSetFs.has(culls, c[0], c[1]) ||
            // Preserve topology.
            leaf.isIntersection) {

            continue;
        }

        let cpNode = leaf.prevOnCircle; // Turn around
        let cut = false;
        while (!cut) {
            cpNode = cpNode.next;

            const { center: c } = cpNode.cp.circle;
            if (!DualSetFs.has(culls, c[0], c[1])) {
                // Cut off the edge once a non-cull has been reached.
                while (isTerminating(cpNode.prevOnCircle)) {
                    cpNode = cpNode.prevOnCircle;
                }
                cut = true;
            } else if (isOnSameCircle(cpNode, maxCpNode)) {
                cut = true; // We are at the max disk - cut whole edge
            } else {
                const cps = getNonTrivialForwardEdges(cpNode);

                if (cps.length === 1) { 
                    continue;
                } else {
                    cut = true;
                }
            }
        }

        if (cut) {
            const cp1 = cpNode.prevOnCircle;
            cp1.next = cpNode;
            cpNode.prev = cp1;

            cp1.nextOnCircle = cpNode;
            cpNode.prevOnCircle = cp1;
        }
    }
}


export { cull }
