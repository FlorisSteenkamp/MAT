import { CpNode } from '../cp-node.js';
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
function traverseEdges(
        cpNode: CpNode,
        traverseEdgesCallback: (cpNode: CpNode) => void) {

    const cpNodes = getAllOnLoop(cpNode);
    const seen = new Set<CpNode>();

    for (cpNode of cpNodes) {
        if (!isTerminating(cpNode) && !seen.has(cpNode.next.prevOnCircle)) {
            traverseEdgesCallback(cpNode);
        }
        seen.add(cpNode);
    }
}


export { traverseEdges }
