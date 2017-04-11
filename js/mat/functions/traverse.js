let PointOnShape = require('../../geometry/classes/point-on-shape.js');

/**
 * Traverses the MAT tree and calls a function on each node. This
 * function must have side effects to be useful.
 * 
 * @param {Mat} mat
 * @returns undefined
 */
function traverse(mat, f) {
	
	helper(mat.startNode, undefined, undefined);
	
	function helper(matNode, priorNode/*, priorIndx*/) {
		f(matNode, priorNode/*, priorIndx*/);
		
		//for (let node of matNode.branches) {
		for (let i=0; i<matNode.branches.length; i++) {
			let node = matNode.branches[i];
			if (node === priorNode) {
				// Don't go back in tracks.
				continue;
			}
			
			helper(node, matNode, i);
		}			
	}
}


module.exports = traverse;