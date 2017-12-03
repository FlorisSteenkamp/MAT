
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
function findNode(
        mat: MatTree, 
        f: (matNode: MatNode, priorNode?: MatNode) => boolean) {
	
	return g(mat.startNode, undefined);
	
	function g(matNode: MatNode, priorNode: MatNode): MatNode {
		if (f(matNode, priorNode)) {
			return matNode;
		};
		
		for (let node of matNode.branches) {
			if (node === priorNode) {
				// Don't go back in tracks.
				continue;
			}
			
			return g(node, matNode);
		}			
	}
}


export default findNode;
