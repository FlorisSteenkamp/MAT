import { Vertex } from '../classes/mat-circle';
/**
 * Traverses the MAT tree and calls a function on each node. This function must
 * have side effects to be useful.
 *
 * Use traverseBranches to traverse the branches instead.
 * @param matCircle
 */
declare function traverseMatCircles(matCircle: Vertex, f: (matCircle: Vertex) => void): void;
export { traverseMatCircles };
