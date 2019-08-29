import { CpNode } from '../cp-node';
/**
 * Traverses all edges (depth first) of the given MAT tree starting at the given
 * vertex (represented by a [[CpNode]]).
 * @param cpNode Any [[CpNode]] representing the start vertex.
 * @param f A callback function for each CpNode representing the vertex at the
 * start of an edge.
  */
declare function traverseEdges(cpNode: CpNode, f: (cpNode: CpNode) => void): void;
export { traverseEdges };
