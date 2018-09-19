import { CpNode } from '../../linked-list/cp-node';
/**
 * Traverses all edges of a MAT starting at the given vertex.
 * @param vertex The start vertex
 * @param f A callback function for each ListNode representing the
 * start each edge.
 */
declare function traverseEdges(cpNode: CpNode, f: (cp: CpNode, isLeaf: boolean) => void, inclLeaves?: boolean): void;
export { traverseEdges };
