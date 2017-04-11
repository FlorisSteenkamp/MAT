/**
 * Traverses the MAT tree and finds a node with a specified property. 
 * 
 * @param {Mat} mat
 * @param {boolean Function({MatNode},{MatNode})} A function that takes
 *        the current and the prior node and should return true if the
 *        node is found or falsy otherwise.
 * @returns {MatNode} The found node or undefined otherwise.
 */
function findNode(mat, f) {
	
	return helper(mat.startNode, undefined);
	
	function helper(matNode, priorNode) {
		if (f(matNode, priorNode)) {
			return matNode;
		};
		
		for (let node of matNode.branches) {
			if (node === priorNode) {
				// Don't go back in tracks.
				continue;
			}
			
			return helper(node, matNode);
		}			
	}
}


module.exports = findNode;