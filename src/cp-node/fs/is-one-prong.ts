import { CpNode } from "../cp-node.js";


// TODO2 - remove - or replace with `getRealProngCount === 1`
function isOneProng(cpNode: CpNode) {
	const cp1 = cpNode;

	if (cp1.cp.circle.radius === 0) {
		return true;
	}

	const cp2 = cp1.nextOnCircle;

	const p1 = cp1.cp.pointOnShape.p;
	const p2 = cp2.cp.pointOnShape.p;

	return (p1[0] === p2[0] && p1[1] === p2[1]);
}


export { isOneProng }
