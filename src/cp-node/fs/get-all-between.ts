import { CpNode } from "../cp-node.js";


/**
 * Returns all `CpNode`s between the two given ones (exclisive the last one).
 * 
 * * If the second `CpNode` is never encountered all on the loop will be
 * returned.
 * 
 * @param cpNodeS 
 * @param cpNodeE 
 * @param inclAllIfEqual if `true` and first and last `CpNode`s are equal then
 * include all `CpNode`s around the loop, otherwise include none.
 */
function getAllBetween(
		cpNodeS: CpNode,
		cpNodeE: CpNode,
		inclAllIfEqual = true) {

	if (!inclAllIfEqual && cpNodeS === cpNodeE) {
		return { cpNodes: [], hasHoleCloser: false }
	}

	const cpStart = cpNodeS;
	const cpNodes: CpNode[] = [cpStart];

	let cpNode_ = cpNodeS.next;
	let hasHoleCloser = cpStart.isHoleClosing;

	while (cpNode_ !== cpNodeE &&
		   cpNode_ !== cpStart) {

		if (cpNode_.isHoleClosing) {
			hasHoleCloser = true;
		}
		cpNodes.push(cpNode_);
		cpNode_ = cpNode_.next;
	}

	return { cpNodes, hasHoleCloser };
}


export { getAllBetween }
