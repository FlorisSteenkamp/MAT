import { CpNode } from './cp-node/cp-node.js';
/**
 * Traverses the MAT tree and calls the given callback function for each vertex
 * (represented by a [[CpNode]]) on the MAT.
 *
 * It is usually preferable to use [[traverseEdges]] as it allows for the
 * traversal of all the smooth curves representing the MAT.
 * @param cpNode Any [[CpNode]] representing the start vertex.
 * @param f A callback function taking a single [[CpNode]] as parameter.
 */
declare function traverseVertices(cpNode: CpNode, f: (cpNode: CpNode) => void): void;
export { traverseVertices };
