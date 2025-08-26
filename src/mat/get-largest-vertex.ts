import { CpNode } from '../cp-node/cp-node.js';
import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';


/** @internal */
function getLargestVertex(cpNode: CpNode) {
	const cpNodes = getAllOnLoop(cpNode);

	return cpNodes.reduce(function(maxCpNode: CpNode, cpNode: CpNode) {
		return maxCpNode.cp.circle.radius >= cpNode.cp.circle.radius
			? maxCpNode
			: cpNode
	}, cpNodes[0]);
}


export { getLargestVertex }
