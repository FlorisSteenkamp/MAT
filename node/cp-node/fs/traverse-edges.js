import { isTerminating } from './is-terminating.js';
import { getAllOnLoop } from './get-all-on-loop.js';
/**
 * Traverses all edges of the given MAT tree exactly once each, calling the
 * callback for one of the two `CpNode`s representing each edge.
 *
 * * the edges are visited in boundary order starting from the given `CpNode`
 *   (not depth first)
 *
 * @param cpNode Any `CpNode` on the MAT.
 * @param traverseEdgesCallback A callback function for each CpNode representing the vertex at the
 * start of an edge.
 */
function traverseEdges(cpNode, traverseEdgesCallback) {
    const cpNodes = getAllOnLoop(cpNode);
    const seen = new Set();
    for (cpNode of cpNodes) {
        if (!isTerminating(cpNode) && !seen.has(cpNode.next.prevOnCircle)) {
            traverseEdgesCallback(cpNode);
        }
        seen.add(cpNode);
    }
}
export { traverseEdges };
//# sourceMappingURL=traverse-edges.js.map