import { CpNode } from "../cp-node.js";


function isSharp(cpNode: CpNode) {
	return cpNode.cp.circle.radius === 0;
}


export { isSharp }
