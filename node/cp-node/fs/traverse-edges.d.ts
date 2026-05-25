import { CpNode } from '../cp-node.js';
/**
 * Traverses all edges (depth first) of the given MAT tree starting at the given
 * vertex (represented by a `CpNode`).
 * @param cpNode Any `CpNode` representing the start vertex.
 * @param traverseEdgesCallback A callback function for each CpNode representing the vertex at the
 * start of an edge.
 */
declare function traverseEdges(cpNode: CpNode, traverseEdgesCallback: (cpNode: CpNode) => void): void;
export { traverseEdges };
