
import LlRbTree from 'flo-ll-rb-tree';

import { CpNode } from '../../cp-node';
import { Loop   } from '../../loop';

import { traverseEdges } from '../traverse-edges';


function createNewCpTree(cpNode: CpNode) {
	let newCpTrees: Map<Loop,LlRbTree<CpNode>> = new Map();

	traverseEdges(cpNode, function(cpNode) {
		let loop = cpNode.cp.pointOnShape.curve.loop;
		let cpTree = newCpTrees.get(loop);
		if (!cpTree) { 
			cpTree = new LlRbTree(CpNode.comparator, [], true); 
			newCpTrees.set(loop, cpTree);
		}
		cpTree.insert(cpNode);
	});

	return newCpTrees;
}


export { createNewCpTree }
