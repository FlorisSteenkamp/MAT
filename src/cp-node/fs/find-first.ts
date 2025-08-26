import { CpNode } from "../cp-node.js";
import { CpNodeFs } from "../cp-node-fs.js";


function findFirst(
        f: (cpNode: CpNode) => CpNode | undefined,
        cpNode: CpNode): CpNode | undefined { 

    const cpStart = cpNode;

    if (f(cpStart)) { return cpStart; }

	let cpNode_ = cpNode.next;
	while (cpNode_ !== cpStart) {
		if (f(cpNode_)) {
            return cpNode_;
        }
		cpNode_ = cpNode_.next;
	}

	return undefined;
}


export { findFirst }
