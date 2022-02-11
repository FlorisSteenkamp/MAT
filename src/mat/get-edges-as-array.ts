import { CpNode } from '../cp-node.js';
import { traverseEdges } from '../traverse-edges.js';


/** @hidden */
function getEdgesAsArray(cpNode: CpNode) {	
	let cpNodes: CpNode[] = [];
	
	traverseEdges(
		cpNode, 
		function(cpNode) { cpNodes.push(cpNode) }
	);
	
	return cpNodes;
}


export { getEdgesAsArray };
