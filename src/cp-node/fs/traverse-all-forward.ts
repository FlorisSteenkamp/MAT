import { CpNode } from '../cp-node.js';
import { isTerminating } from './is-terminating.js';
import { getChildren } from './get-children.js';


function traverseAllForward(
		cpNode: CpNode,
		traverseEdgesCallback: (cpNode: CpNode) => void) {

	// Since the tree is unrooted we must iterate in all directions from the
	// given vertex.
	const cps = [cpNode];

	while (cps.length) {
		const cp = cps.pop()!;
		traverseEdgesCallback(cp);

		if (isTerminating(cp)) { continue; }
		cps.push(...getChildren(cp));
	}
}


export { traverseAllForward }
