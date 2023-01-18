import { CpNode } from '../cp-node.js';
import { traverseEdges } from '../traverse-edges.js';


/** @internal */
function getEdgesAsArray(cpNode: CpNode) {	
	const cpNodes: CpNode[] = [];
	
	traverseEdges(
		cpNode, 
		function(cpNode) { cpNodes.push(cpNode) }
	);
	
	return cpNodes;
}


export { getEdgesAsArray };
