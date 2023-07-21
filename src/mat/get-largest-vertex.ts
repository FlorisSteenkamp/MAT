import { CpNode } from '../cp-node/cp-node.js';


/** @internal */
function getLargestVertex(cpNodes: CpNode[]) {
	return cpNodes.reduce(function(maxCpNode: CpNode, cpNode: CpNode) {
		return maxCpNode.cp.circle.radius >= cpNode.cp.circle.radius
			? maxCpNode
			: cpNode
	}, cpNodes[0]);
}


export { getLargestVertex }
