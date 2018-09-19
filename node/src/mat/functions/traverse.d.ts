import { MatNode } from '../classes/mat-node';
import { Branch } from '../classes/branch';
export declare type TTraverseCallback = (matNode: MatNode, prevNode?: MatNode, branchTaken?: Branch) => void;
/**
 * Traverses the MAT tree and calls a function on each node. This function must
 * have side effects to be useful.
 *
 * @param node
 */
declare function traverse(node: MatNode, f: TTraverseCallback): void;
export { traverse };
