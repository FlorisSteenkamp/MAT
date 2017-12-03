import MatNode from '../../mat/classes/mat-node';
import ContactPoint from '../../mat/classes/contact-point';
import Shape from '../../geometry/classes/shape';
import ListNode from '../../linked-list/list-node';
/**
 * Recursively builds the MAT tree.
 *
 * @param {ListNode} cpNodeStart
 * @returns {MatNode}
 */
declare function buildMat(shape: Shape, cpNodeStart: ListNode<ContactPoint>, fromNode: MatNode, fromCpNode: ListNode<ContactPoint>, isRetry: boolean): MatNode;
export default buildMat;
