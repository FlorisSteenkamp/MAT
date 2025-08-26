import { CpNode } from "../cp-node.js";


function getChildren(cpNode: CpNode) {
	const children: CpNode[] = [];

	const cp = cpNode.next;
	let cpNode_ = cp;
	do {
		children.push(cpNode_); 
		cpNode_ = cpNode_.nextOnCircle;
	} while (cpNode_.nextOnCircle !== cp);

	return children;
}


export { getChildren }
