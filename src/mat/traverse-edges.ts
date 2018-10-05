
import { CpNode } from '../cp-node';


/**
 * Traverses all edges (depth first) of a MAT starting at the given vertex (
 * represented by a CpNode). The traversal always progresses towards the leave 
 * nodes.
 * @param cpNode The CpNode representing the start vertex
 * @param f A callback function for each CpNode representing the vertex at the 
 * start of an edge.
 * @param inclLeaves If truthy then include the leaves, otherwise don't.
 */
function traverseEdges(
		cpNode: CpNode,
		f: (cp: CpNode, isLeaf: boolean) => void,
		inclLeaves: boolean = false) {

	let cps = cpNode.getNodes();

	while (cps.length) {
		let cp = cps.pop();

		while (!cp.isTerminating()) {
			f(cp, false);

			cp = cp.next;

			if (cp.isThreeProng()) {
				cps.push(cp.nextOnCircle); 
			}
		}

		if (inclLeaves) {
			f(cp, true);
		}
	}
}


export { traverseEdges };
