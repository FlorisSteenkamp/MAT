/**
 * Representation of a node in the MAT structure.
 * 
 * @param {MatCircle} matCircle
 * @param branches
 * @returns
 */


let MatCircle = require('./mat-circle.js');


function MatNode(matCircle, branches) {
	this.matCircle = matCircle;
	this.branches  = branches;		
} 


MatNode.copy = function(node) {
	
	return helper(node, undefined);
	
	function helper(matNode, priorNode, newPriorNode) {
		
		let branches = [];
		//let newNode = new MatNode(MatCircle.copy(matNode.matCircle), branches);
		let newNode = new MatNode(matNode.matCircle, branches);
		
		for (let node of matNode.branches) {
			if (node === priorNode) {
				// Don't go back in tracks.
				branches.push(newPriorNode);
				continue;
			}
			
			branches.push(helper(node, matNode, newNode));
		}
		
		//if (!priorNode) { console.log(newNode)}
		return newNode;
	}
}


module.exports = MatNode;







