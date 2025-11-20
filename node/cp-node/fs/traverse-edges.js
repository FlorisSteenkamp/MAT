import { isTerminating } from './is-terminating.js';
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
async function traverseEdges$$(cpNode, traverseEdgesCallback) {
    const cpNodes = getAllOnLoop(cpNode);
    const seen = new Set();
    for (cpNode of cpNodes) {
        if (!isTerminating(cpNode) && !seen.has(cpNode.next.prevOnCircle)) {
            await traverseEdgesCallback(cpNode);
        }
        seen.add(cpNode);
    }
}
function traverseEdges(cpNode, traverseEdgesCallback) {
    const cpNodes = getAllOnLoop(cpNode);
    const seen = new Set();
    for (cpNode of cpNodes) {
        if (!isTerminating(cpNode) && !seen.has(cpNode.next.prevOnCircle)) {
            traverseEdgesCallback(cpNode);
        }
        seen.add(cpNode);
    }
}
function* $traverseEdges(cpNode) {
    const cpNodes = getAllOnLoop(cpNode);
    const seen = new Set();
    for (cpNode of cpNodes) {
        if (!isTerminating(cpNode) && !seen.has(cpNode.next.prevOnCircle)) {
            yield cpNode;
        }
        seen.add(cpNode);
    }
}
export { traverseEdges, $traverseEdges, traverseEdges$$ };
//# sourceMappingURL=traverse-edges.js.map