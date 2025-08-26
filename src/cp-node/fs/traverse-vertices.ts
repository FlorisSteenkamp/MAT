import { CpNode } from '../cp-node.js';
import { CpNodeFs } from '../cp-node-fs.js';
import { getAllOnCircle } from './get-all-on-circle.js';
import { isTerminating } from './is-terminating.js';
import { getVertexForwardChildren } from './get-vertex-forward-children.js';


function traverseVertices(
		cpStart: CpNode, 
		traverseVerticesCallback: (cpNode: CpNode) => void) {

	traverseVerticesCallback(cpStart);

	// Since the tree is unrooted we must iterate in all directions from the
	// given cpNode.
	const cpNodes = 
		getAllOnCircle(cpStart)
		.filter(cpNode => !isTerminating(cpNode))
		.map(cpNode => cpNode.next);

	for (const cpNode of cpNodes) {
		const cps = [cpNode];
		while (cps.length) {
			const cp = cps.pop()!;
			traverseVerticesCallback(cp);
			cps.push(...getVertexForwardChildren(cp));
		}
	}
}


export { traverseVertices }
