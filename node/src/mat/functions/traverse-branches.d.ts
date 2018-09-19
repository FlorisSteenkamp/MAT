import { Edge } from '../classes/edge';
import { MatCircle } from '../classes/mat-circle';
/**
 * Traverses the MAT tree and calls a function on each branch. This function
 * must have side effects to be useful.
 *
 * Use traverseNodes to traverse the nodes instead.
 * @param node
 */
declare function traverseBranches(node: MatCircle, f: (matCircle: MatCircle, prevNode?: MatCircle, branchTaken?: Edge) => void): void;
export { traverseBranches };
