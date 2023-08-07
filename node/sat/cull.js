import { getLeaves } from './get-leaves.js';
import { isOnSameCircle } from '../cp-node/cp-node.js';
/**
 * @internal
 * Returns the set of Vertices passing the following test: walk the MAT tree and
 * keep all Vertices not in the current cull set and any Vertices that have a
 * non-culled node further down the line toward the tree leaves.
 * @param culls The CpNodes (referred to by circles) that should be culled.
 * @param maxCpNode The start CpNode which must reprsesent the maximal vertex.
 */
function cull(culls, maxCpNode) {
    const leaves = getLeaves(maxCpNode);
    function getNonTrivialEdges(cpStart) {
        let cp = cpStart;
        const cps = [];
        do {
            if (cp.next !== cp.nextOnCircle) {
                cps.push(cp);
            }
            cp = cp.nextOnCircle;
        } while (cp !== cpStart.prevOnCircle);
        return cps;
    }
    while (leaves.length) {
        const leaf = leaves.pop();
        // Preserve topology.
        if (leaf.isHoleClosing || leaf.isIntersection) {
            continue;
        }
        if (!culls.has(leaf.cp.circle)) {
            continue;
        }
        let cpNode = leaf.next; // Turn around
        while (true) {
            cpNode = cpNode.next;
            let cut = false;
            const cp1 = cpNode.prevOnCircle;
            if (!culls.has(cpNode.cp.circle)) {
                // Cut off the edge once a non-cull has been reached.
                cut = true;
            }
            else if (isOnSameCircle(cpNode, maxCpNode)) {
                cut = true; // We are at the max disk - cut whole edge
            }
            else {
                const cps = getNonTrivialEdges(cpNode);
                if (cps.length === 1) {
                    cpNode = cps[0];
                }
                else {
                    cut = true;
                }
            }
            if (cut) {
                cp1.next = cpNode;
                cpNode.prev = cp1;
                break;
            }
        }
    }
}
export { cull };
//# sourceMappingURL=cull.js.map