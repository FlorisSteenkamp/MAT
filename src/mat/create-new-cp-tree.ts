import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode, cpNodeComparator, getAllOnLoop } from '../cp-node/cp-node.js';
import { Loop } from 'flo-boolean';


/**
 * @internal
 * @param cpNode 
 */
function createNewCpTree(cpNode: CpNode) {
	const newCpTrees: Map<Loop,LlRbTree<CpNode>> = new Map();

	getAllOnLoop(cpNode).forEach(createNewCpTree_);

	function createNewCpTree_(cpNode: CpNode) {
		const loop = cpNode.cp.pointOnShape.curve.loop;
		let cpTree = newCpTrees.get(loop);
		if (!cpTree) { 
			cpTree = new LlRbTree(cpNodeComparator, false); 
			newCpTrees.set(loop, cpTree);
		}
		cpTree.insert(cpNode);
	}

	return newCpTrees;
}


export { createNewCpTree }
