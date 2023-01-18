import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from '../cp-node.js';
import { Loop } from '../loop.js';


/**
 * @hidden
 * @param cpNode 
 */
function createNewCpTree(cpNode: CpNode) {
	const newCpTrees: Map<Loop,LlRbTree<CpNode>> = new Map();

	const cps = cpNode.getAllOnLoop();

	cps.forEach(f);

	function f(cpNode: CpNode) {
		const loop = cpNode.cp.pointOnShape.curve.loop;
		let cpTree = newCpTrees.get(loop);
		if (!cpTree) { 
			// qqq cpTree = new LlRbTree(CpNode.comparator, [], true); 
			cpTree = new LlRbTree(CpNode.comparator, false); 
			newCpTrees.set(loop, cpTree);
		}
		cpTree.insert(cpNode);
	}

	return newCpTrees;
}


export { createNewCpTree }
