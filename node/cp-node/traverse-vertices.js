import { getCpNodesOnCircle, isTerminating, vertexChildren } from './cp-node.js';
/**
 * Traverses the MAT tree and calls the given callback function for each vertex
 * (represented by a [[CpNode]]) on the MAT.
 *
 * It is usually preferable to use [[traverseEdges]] as it allows for the
 * traversal of all the smooth curves representing the MAT.
 * @param cpNode Any [[CpNode]] representing the start vertex.
 * @param f A callback function taking a single [[CpNode]] as parameter.
 */
function traverseVertices(cpNode, f) {
    f(cpNode);
    // Since the tree is unrooted we must iterate in all directions from the
    // given cpNode.	
    getCpNodesOnCircle(cpNode)
        .filter(cpNode => !isTerminating(cpNode))
        .map(cpNode => cpNode.next)
        .forEach(f_);
    function f_(cpNode) {
        const cps = [cpNode];
        while (cps.length) {
            const cp = cps.pop();
            f(cp);
            cps.push(...vertexChildren(cp));
        }
    }
}
export { traverseVertices };
//# sourceMappingURL=traverse-vertices.js.map