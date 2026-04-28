import { isTerminating } from './is-terminating.js';
import { getAllOnLoop } from './get-all-on-loop.js';
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