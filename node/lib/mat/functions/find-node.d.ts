import MatTree from '../classes/mat-tree';
import MatNode from '../classes/mat-node';
/**
 * Traverses the MAT tree and finds a node with a specified property.
 *
 * @param mat
 * @param {boolean Function({MatNode},{MatNode})} A function that takes
 *        the current and the prior node and should return true if the
 *        node is found or falsy otherwise.
 * @returns {MatNode} The found node or undefined otherwise.
 */
declare function findNode(mat: MatTree, f: (matNode: MatNode, priorNode?: MatNode) => boolean): MatNode;
export default findNode;
