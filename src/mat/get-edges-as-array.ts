
import { CpNode } from '../cp-node/cp-node';
import { traverseEdges } from '../traverse-edges';


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
