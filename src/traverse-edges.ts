import { CpNode, getChildren, getCpNodesOnCircle, isTerminating } from './cp-node/cp-node.js';


/**
 * Traverses all edges (depth first) of the given MAT tree starting at the given 
 * vertex (represented by a [[CpNode]]).
 * @param cpNode Any [[CpNode]] representing the start vertex.
 * @param f A callback function for each CpNode representing the vertex at the 
 * start of an edge.
  */
function traverseEdges(
		cpNode: CpNode,
		f: (cpNode: CpNode) => void) {

	// Since the tree is unrooted we must iterate in all directions from the
	// given vertex.
	const cps = getCpNodesOnCircle(cpNode);

	let ii = 0; // TODO2 - remove
	while (cps.length/* && ii<1500*/) {
		ii++;
		const cp = cps.pop()!;
		f(cp);

		if (isTerminating(cp)) { continue; }
		cps.push(...getChildren(cp));
	}
}


export { traverseEdges }
