import { CpNode } from "../cp-node.js";


function getProngCount(cpNode: CpNode) {
	const startCpNode = cpNode;
	let cpNode_ = startCpNode;

	let i = 0;
	do {
		i++;
		cpNode_ = cpNode_.nextOnCircle;
	} while (cpNode_ !== startCpNode)

	return i;
}


export { getProngCount }
