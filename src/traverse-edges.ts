
import { CpNode } from './cp-node';


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
	let cps = cpNode.getCpNodesOnCircle();

	while (cps.length) {
		let cp = cps.pop();
		f(cp);
		cps.push(...cp.children);
	}
}


export { traverseEdges };
