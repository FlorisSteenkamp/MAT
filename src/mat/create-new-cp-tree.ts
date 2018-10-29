
import LlRbTree from 'flo-ll-rb-tree';

import { CpNode } from '../cp-node';
import { Loop   } from '../loop';

import { traverseEdges } from '../traverse-edges';


function createNewCpTree(cpNode: CpNode) {
	let newCpTrees: Map<Loop,LlRbTree<CpNode>> = new Map();

	let cps = cpNode.getAllOnLoop();

	cps.forEach(f);

	// TODO - (done) This function is broken! We must simply go around the shape with 
	// cpNode.next.next... instead of using traverseEdges. 
	//traverseEdges(cpNode, f, true);

	function f(cpNode: CpNode) {
		let loop = cpNode.cp.pointOnShape.curve.loop;
		let cpTree = newCpTrees.get(loop);
		if (!cpTree) { 
			cpTree = new LlRbTree(CpNode.comparator, [], true); 
			newCpTrees.set(loop, cpTree);
		}
		cpTree.insert(cpNode);
	}

	return newCpTrees;
}


export { createNewCpTree }
