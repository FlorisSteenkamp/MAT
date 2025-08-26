import { CpNode } from "../cp-node.js";


function getAllOnLoop(cpNode: CpNode) {
	const cpStart = cpNode;
	const cpNodes: CpNode[] = [cpStart];
	let cpNode_ = cpNode.next;

	while (cpNode_ !== cpStart) {
		cpNodes.push(cpNode_);
		cpNode_ = cpNode_.next;
	}

	return cpNodes;
}


export { getAllOnLoop }
