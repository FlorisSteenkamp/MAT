import { CpNode } from '../cp-node/cp-node.js';
import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';
import { getRealProngCount } from '../cp-node/fs/get-real-prong-count.js';


/** @internal */
function getLargest3Prong(cpNode: CpNode) {
	const cpNodes = getAllOnLoop(cpNode)
		.filter(cpNode => getRealProngCount(cpNode) >= 3);

	if (cpNodes.length === 0) { return undefined; }

	return cpNodes.reduce(function(maxCpNode: CpNode, cpNode: CpNode) {
		return maxCpNode.cp.circle.radius >= cpNode.cp.circle.radius
			? maxCpNode
			: cpNode
	}, cpNodes[0]);
}


export { getLargest3Prong }
