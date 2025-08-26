import { CpNode } from "../cp-node.js";


function isTerminating(cpNode: CpNode) {
	return cpNode === cpNode.next.prevOnCircle;
}


export { isTerminating }
