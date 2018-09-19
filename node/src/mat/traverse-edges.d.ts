import { CpNode } from '../cp-node';
/**
 * Traverses all edges (depth first) of a MAT starting at the given vertex.
 * @param cpNode The contact point representing the start vertex
 * @param f A callback function for each cpNode representing the start of and
 * edge.
 * @param inclLeaves If truthy then include the leaves, otherwise don't.
 */
declare function traverseEdges(cpNode: CpNode, f: (cp: CpNode, isLeaf: boolean) => void, inclLeaves?: boolean): void;
export { traverseEdges };
