'use strict'

let findNode = require('./find-node.js');


/**
 * 
 * Get the branches from the given MAT.
 * 
 * @param mat
 * @param _debug_
 * @returns
 */

function getBranches(mat, _debug_) {
	
	// Start at a node with 1 or 3 branches.
	let startNode = findNode(mat, function(node) {
		return node.branches.length !== 2;
	});
	

	let branchCount = 0;
	helper(startNode, undefined, 0);
	console.log(branchCount);
	
	function helper(matNode, priorNode, depth) {
		for (let i=0; i<matNode.branches.length; i++) {
			let node = matNode.branches[i];
			if (node === priorNode) {
				// Don't go back in tracks.
				continue;
			}
			
			branchCount++;
			let branch = traverseSingleBranch(
					matNode, i
			);
			//console.log(branch);
			for (let node of branch) {
				let color = ['red', 'blue', 'green'][i];
				_debug_.drawDot(node.matCircle.circle.center, 1, color);
			}
			
			
			let endNode = branch[branch.length-1];
			let prevNode = branch[branch.length-2];

			if (_debug_) {
				//_debug_.drawDot(endNode.matCircle.circle.center, 2, 'yellow');	
			}
			helper(endNode, prevNode, depth + 1);
		}
	} 
}


/**
 * Traverses from the given node which should be a 3 or 1 prong to
 * the next 3 or 1 prong in the direction of the given branch index.
 */
function traverseSingleBranch(matNode, branchIndx) {
	
	let branch = [matNode]; 
	
	helper(matNode.branches[branchIndx], matNode);
	return branch;
	
	function helper(matNode, priorNode) {
		branch.push(matNode);
		if (matNode.branches.length !== 2) {
			return;
		}
		
		for (let node of matNode.branches) {
			if (node === priorNode) {
				// Don't go back in tracks.
				continue;
			}
			
			helper(node, matNode);
		}			
	}
}


module.exports = getBranches;