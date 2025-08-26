import { CpNode } from "../cp-node.js";
import { getAllOnCircle } from "./get-all-on-circle.js";
import { isTerminating } from "./is-terminating.js";


function getRealProngCount(cpNode: CpNode) {
	const nonTerminatingCpNodes = getAllOnCircle(cpNode)
	.filter(cpNode => !isTerminating(cpNode));

	return nonTerminatingCpNodes.length;
}


export { getRealProngCount }
