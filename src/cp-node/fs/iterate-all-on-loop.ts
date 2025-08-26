import { CpNode } from "../cp-node.js";


function* iterateAllOnLoop(cpNode: CpNode) {
	yield cpNode;

	let cpNode_ = cpNode.next;
	while (cpNode_ !== cpNode) {
		yield cpNode_;
		cpNode_ = cpNode_.next;
	}
}


export { iterateAllOnLoop }
