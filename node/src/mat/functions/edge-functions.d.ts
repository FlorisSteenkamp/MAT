import { CpNode } from '../../linked-list/cp-node';
/**
 * Marks the given edge as already taken.
 */
declare function markEdgeAsTaken(visitedEdges: Map<CpNode, Set<CpNode>>, cp1: CpNode, cp2: CpNode): void;
declare function hasEdgeBeenTaken(visitedEdges: Map<CpNode, Set<CpNode>>, cp1: CpNode, cp2: CpNode): boolean;
export { markEdgeAsTaken, hasEdgeBeenTaken };
