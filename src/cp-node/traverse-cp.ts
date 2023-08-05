import { CpNode } from "./cp-node";


/**
 * @internal
 * 
 * Traverses the shape from the given `CpNode` going around the shortest path
 * so that only a piece of the shape is traversed and returns the visited 
 * `CpNode`s (starting from the given `CpNode`).
 * 
 * @param cpStart The `CpNode` from where to start the traversal.
 */
function traverseCp(cpStart: CpNode) {
	let cpNode = cpStart;

	if (cpNode === cpNode.next.prevOnCircle) {
		return [cpNode];  // one-sharp corner
	}

	const visitedCps: CpNode[] = [];
	do {
		visitedCps.push(cpNode);
	
		const next = cpNode.next.prevOnCircle;
		cpNode = cpNode === next
				? cpNode = cpNode.next.next // Terminal vertex
				: cpNode = next         // Take last exit
	
	} while (cpNode !== cpStart); 
	
	return visitedCps;
}


export { traverseCp }
