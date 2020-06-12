"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseEdges = void 0;
/**
 * Traverses all edges (depth first) of the given MAT tree starting at the given
 * vertex (represented by a [[CpNode]]).
 * @param cpNode Any [[CpNode]] representing the start vertex.
 * @param f A callback function for each CpNode representing the vertex at the
 * start of an edge.
  */
function traverseEdges(cpNode, f) {
    // Since the tree is unrooted we must iterate in all directions from the
    // given vertex.
    let cps = cpNode.getCpNodesOnCircle();
    while (cps.length) {
        let cp = cps.pop();
        f(cp);
        if (cp.isTerminating()) {
            continue;
        }
        cps.push(...cp.getChildren());
    }
}
exports.traverseEdges = traverseEdges;
//# sourceMappingURL=traverse-edges.js.map