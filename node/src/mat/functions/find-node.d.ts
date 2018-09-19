import { Vertex } from '../classes/mat-circle';
/**
 * Traverses the MAT tree and finds a node with a specified property.
 * @param mat
 * @param f A function that takes the current and the prior node and should
 * return true if the node is found or falsy otherwise.
 */
declare function findNode(mat: Vertex, f: (vertex: Vertex, priorCircle?: Vertex) => boolean): Vertex;
export { findNode };
