import { CpNode } from '../cp-node/cp-node.js';


/** @internal */
function getLargestThreeProng(cpNodes: CpNode[]) {
	return cpNodes.reduce(function(maxCpNode: CpNode, cpNode: CpNode) {
		return cpNode === undefined || maxCpNode.cp.circle.radius >= cpNode.cp.circle.radius
			? maxCpNode
			: cpNode;
	}, undefined!);
}


export { getLargestThreeProng }
