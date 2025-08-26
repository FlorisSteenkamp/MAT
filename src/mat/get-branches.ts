import { CpNode } from '../cp-node/cp-node.js';
import { getBranch } from '../cp-node/fs/get-branch.js';
import { getNonTerminatingOnCircle } from '../cp-node/fs/get-non-terminating-on-circle.js';


function getBranches(
		cpNode: CpNode): CpNode[][] {

	const branches: CpNode[][] = [];
	const cpNodeStack: CpNode[] = [cpNode];
	const takenBranches: Set<CpNode> = new Set();
	while (cpNodeStack.length > 0) {
		const cpNode = cpNodeStack.pop()!;
		const branch = getBranch(cpNode);

		if (branch.length === 0) {
			continue;
		}

		branches.push(branch);

		const cpNodeS = branch[0];
		const cpNodeE = branch[branch.length-1].next.prevOnCircle;

		takenBranches.add(cpNodeS);
		takenBranches.add(cpNodeE);

		const _cpNodesS = getNonTerminatingOnCircle(cpNodeS, true);
		const _cpNodesE = getNonTerminatingOnCircle(cpNodeE, true);
		const cpNodesS = _cpNodesS.filter(cpNode => !takenBranches.has(cpNode));
		const cpNodesE = _cpNodesE.filter(cpNode => !takenBranches.has(cpNode));

		for (const cpNode of cpNodesS) {
			takenBranches.add(cpNode);
		}
		for (const cpNode of cpNodesE) {
			takenBranches.add(cpNode);
		}

		cpNodeStack.push(...cpNodesS, ...cpNodesE);
	}

	return branches;
}


export { getBranches }
