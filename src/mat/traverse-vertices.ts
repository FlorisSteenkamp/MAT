
import { Circle } from '../circle';
import { CpNode } from '../cp-node';


/**
 * Traverses the MAT tree and finds and returns the first MAT circle as an array 
 * with one element (or all) with a specified property defined by the given 
 * predicate function. Returns [] if no circle with the specified 
 * property has been found.
 * @param cpNode Root of MAT tree
 * @param f A function that should return true if the circle passes the criteria
 * necessary to be returned or falsy otherwise.
 * @param returnFirst If true, returns as soon as the first circle passing 
 * f(circle) was found as [Circle]. False by default.
 */
// TODO - change so it returns an array of CpNode instead.
function traverseVertices(
		cpNode: CpNode, 
		f: (cpNode: CpNode) => boolean | void,
		returnFirst: boolean = false): CpNode[] {

	let cpNodes: CpNode[] = [];			

	if (f(cpNode)) { 
		cpNodes.push(cpNode);
		if (returnFirst) { return cpNodes; } 
	};
	
	let cps = cpNode.getCps();

	while (cps.length) {
		let cpNode = cps.pop();

		while (!cpNode.isTerminating()) {
			cpNode = cpNode.next;

			if (f(cpNode)) { 
				cpNodes.push(cpNode);
				if (returnFirst) { return cpNodes; } 
			};

			if (cpNode.isThreeProng()) {
				cps.push(cpNode.nextOnCircle); 
			}
		}
	}

	return cpNodes;
}


export { traverseVertices };
