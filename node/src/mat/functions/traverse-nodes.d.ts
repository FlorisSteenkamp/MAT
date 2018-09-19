import { MatCircle } from '../classes/mat-circle';
/**
 * Traverses the MAT tree and calls a function on each node. This function must
 * have side effects to be useful.
 *
 * Use traverseBranches to traverse the branches instead.
 * @param mat
 */
declare function traverseNodes(mat: MatCircle, f: (mat: MatCircle) => void): void;
export { traverseNodes };
