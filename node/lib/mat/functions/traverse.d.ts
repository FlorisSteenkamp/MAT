import MatTree from '../classes/mat-tree';
import MatNode from '../classes/mat-node';
/**
 * Traverses the MAT tree and calls a function on each node. This
 * function must have side effects to be useful.
 *
 * @param mat
 */
declare function traverse(mat: MatTree, f: (matNode: MatNode, priorNode: MatNode) => void): void;
export default traverse;
