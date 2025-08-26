import { CpNode } from "../cp-node.js";


function getFirstExit(cpNode: CpNode) {
	// const startNode = this as CpNode;
	const startNode = cpNode;
	let cpNode_ = startNode;

	while (cpNode_.next === cpNode_.prevOnCircle) {
		cpNode_ = cpNode_.next;

		if (cpNode_ === startNode) {
			// The very special case the MAT is a single point.
			return undefined; 
		}
	}

	return cpNode_;
}


export { getFirstExit }
