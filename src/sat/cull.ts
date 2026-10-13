import type { CpNode } from '../cp-node/cp-node.js';
import type { Circle } from '../geometry/circle.js';
import type { Mutable } from '../utils/mutable.js';
import { getLeaves } from './get-leaves.js';
import { isTerminating } from '../cp-node/fs/is-terminating.js';
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
 * Culls (in place) the vertices of the given MAT tree: walking the tree from
 * the maximal vertex, all vertices in the cull set are removed except those
 * that have a non-culled vertex further down the line toward the tree leaves
 * (which are kept to preserve the topology).
 *
 * @param culls the vertices (identified by their `Circle`) that should be culled
 * @param maxCpNode the start `CpNode` which must represent the maximal vertex
 * 
 * @internal
 */
function cull(
        culls: Set<Circle>,
        maxCpNode: CpNode) {

    const leaves = getLeaves(maxCpNode);

    while (leaves.length) {
        const leaf = leaves.pop()!;

        if (!culls.has(leaf.pointOnShape.circle) ||
            // Preserve topology.
            leaf.isIntersection) {

            continue;
        }

        let cpNode = leaf.prevOnCircle; // Turn around
        let cut = false;
        while (!cut) {
            cpNode = cpNode.next;

            if (!culls.has(cpNode.pointOnShape.circle)) {
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

        // Cut the edge: link the node we stopped at directly to the one before
        // it on its circle (`cut` is necessarily `true` here; the on-circle
        // links are already consistent by the ring invariant)
        const cp1 = cpNode.prevOnCircle as Mutable<CpNode>;
        cp1.next = cpNode;
        (cpNode as Mutable<CpNode>).prev = cp1;
    }
}


export { cull }
