import { CpNode } from '../cp-node.js';
import { getAllOnCircle } from './get-all-on-circle.js';
import { isTerminating } from './is-terminating.js';
import { getChildren } from './get-children.js';
import { getAllOnLoop } from './get-all-on-loop.js';


// function traverseEdges2(
// 		cpNode: CpNode,
// 		traverseEdgesCallback: (cpNode: CpNode) => void) {

// 	// Since the tree is unrooted we must iterate in all directions from the
// 	// given vertex.
// 	const cps = getAllOnCircle(cpNode);

// 	while (cps.length) {
// 		const cp = cps.pop()!;
// 		traverseEdgesCallback(cp);

// 		if (isTerminating(cp)) { continue; }
// 		cps.push(...getChildren(cp));
// 	}
// }


async function traverseEdges$$(
		cpNode: CpNode,
		traverseEdgesCallback: (cpNode: CpNode) => Promise<void>) {

	const cpNodes = getAllOnLoop(cpNode);
	const seen = new Set<CpNode>();

	for (cpNode of cpNodes) {
		if (!isTerminating(cpNode) && !seen.has(cpNode.next.prevOnCircle)) {
			await traverseEdgesCallback(cpNode);
		}
		seen.add(cpNode);
	}
}


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


function* $traverseEdges(cpNode: CpNode) {
	const cpNodes = getAllOnLoop(cpNode);
	const seen = new Set<CpNode>();

	for (cpNode of cpNodes) {
		if (!isTerminating(cpNode) && !seen.has(cpNode.next.prevOnCircle)) {
			yield cpNode;
		}
		seen.add(cpNode);
	}
}


export { traverseEdges, $traverseEdges, traverseEdges$$ }
