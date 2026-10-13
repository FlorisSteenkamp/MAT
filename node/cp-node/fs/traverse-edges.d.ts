import { CpNode } from '../cp-node.js';
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
declare function traverseEdges(cpNode: CpNode, traverseEdgesCallback: (cpNode: CpNode) => void): void;
export { traverseEdges };
