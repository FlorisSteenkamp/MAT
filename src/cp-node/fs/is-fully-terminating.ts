import { CpNode } from "../cp-node.js";
import { getAllOnCircle } from "./get-all-on-circle.js";
import { isTerminating } from "./is-terminating.js";


function isFullyTerminating(cpNode: CpNode) {
	const otherOnCircle = getAllOnCircle(cpNode.prevOnCircle, true);

	return otherOnCircle.every(isTerminating);
}


export { isFullyTerminating }
