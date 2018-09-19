
import { CpNode } from '../cp-node';

import { traverseVertices } from './traverse-vertices';


function getVerticesAsArray(cpNode: CpNode) {	
	let cpNodes: CpNode[] = [];
	
	traverseVertices(cpNode, 
		cpNode => { cpNodes.push(cpNode) }
	);
	
	return cpNodes;
}


export { getVerticesAsArray };
