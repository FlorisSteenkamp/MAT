import { CpNode } from '../cp-node.js';
import { isTerminating } from './is-terminating.js';
import { getAllOnLoop } from './get-all-on-loop.js';


function traverseEdges(
		cpNode: CpNode,
		traverseEdgesCallback: (cpNode: CpNode) => void) {

	const cpNodes = getAllOnLoop(cpNode);
	const seen = new Set<CpNode>();

	for (cpNode of cpNodes) {
		if (!isTerminating(cpNode) && !seen.has(cpNode.next.prevOnCircle)) {
			traverseEdgesCallback(cpNode);
		}
		seen.add(cpNode);
	}
}


export { traverseEdges }
