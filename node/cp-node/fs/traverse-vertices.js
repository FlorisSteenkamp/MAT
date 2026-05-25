import { getAllOnCircle } from './get-all-on-circle.js';
import { isTerminating } from './is-terminating.js';
import { getVertexForwardChildren } from './get-vertex-forward-children.js';
/**
 * Traverses the MAT tree and calls the given callback function for each vertex
 * (represented by a `CpNode`) on the MAT.
 *
 * It is usually preferable to use `traverseEdges` as it allows for the
 * traversal of all the smooth curves representing the MAT.
 * @param cpNode Any `CpNode` representing the start vertex.
 * @param traverseVerticesCallback A callback function taking a single `CpNode` as parameter.
 */
function traverseVertices(cpStart, traverseVerticesCallback) {
    traverseVerticesCallback(cpStart);
    // Since the tree is unrooted we must iterate in all directions from the
    // given cpNode.
    const cpNodes = getAllOnCircle(cpStart)
        .filter(cpNode => !isTerminating(cpNode))
        .map(cpNode => cpNode.next);
    for (const cpNode of cpNodes) {
        const cps = [cpNode];
        while (cps.length) {
            const cp = cps.pop();
            traverseVerticesCallback(cp);
            cps.push(...getVertexForwardChildren(cp));
        }
    }
}
export { traverseVertices };
//# sourceMappingURL=traverse-vertices.js.map