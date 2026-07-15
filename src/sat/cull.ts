import type { CpNode } from '../cp-node/cp-node.js';
import type { DualSet } from '../utils/dual-set.js';
import type { Mutable } from '../utils/mutable.js';
import { getLeaves } from './get-leaves.js';
import { isTerminating } from '../cp-node/fs/is-terminating.js';
import { DualSetFs } from '../utils/dual-set.js';
import { isOnSameCircle } from '../cp-node/fs/is-on-same-circle.js';


/**
 * Returns the set of non-trivial forward edges starting from the given `CpNode`.
 * 
 * @param cpStart the start `CpNode`
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
 * Returns the set of Vertices passing the following test: walk the MAT tree and 
 * keep all Vertices not in the current cull set and any Vertices that have a 
 * non-culled node further down the line toward the tree leaves.
 * 
 * @param culls the `CpNode`s (referred to by circles) that should be culled
 * @param maxCpNode the start `CpNode` which must represent the maximal vertex
 * 
 * @internal
 */
function cull(
        culls: DualSet<number, number>,
        maxCpNode: CpNode) {

    const leaves = getLeaves(maxCpNode);

    while (leaves.length) {
        const leaf = leaves.pop()!;

        const { center: c } = leaf.pointOnShape.circle;
        if (!DualSetFs.has(culls, c[0], c[1]) ||
            // Preserve topology.
            leaf.isIntersection) {

            continue;
        }

        let cpNode = leaf.prevOnCircle; // Turn around
        let cut = false;
        while (!cut) {
            cpNode = cpNode.next;

            const { center: c } = cpNode.pointOnShape.circle;
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
            const cp1 = cpNode.prevOnCircle as Mutable<CpNode>;
            cp1.next = cpNode;
            (cpNode as Mutable<CpNode>).prev = cp1;

            cp1.nextOnCircle = cpNode;
            (cpNode as Mutable<CpNode>).prevOnCircle = cp1;
        }
    }
}


export { cull }
