import { isTerminating } from './is-terminating.js';
import { getAllOnLoop } from './get-all-on-loop.js';
/**
 * Traverses all edges (depth first) of the given MAT tree starting at the given
 * vertex (represented by a `CpNode`).
 * @param cpNode Any `CpNode` representing the start vertex.
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