
import { CpNode } from './cp-node';
import { tangent } from 'flo-bezier3';
import { cross } from 'flo-vector2d';
import { getCurveToNext } from './get-curve-to-next';


/** @hidden */
const defaultTolerance = 1; // 1 degree


/**
 * Traverses all edges (depth first) of the given MAT tree starting at the given 
 * vertex (represented by a [[CpNode]]). Returns the result as an array of
 * smooth branches, where smoothness is total or within a given tolerance.
 * @param cpNode Any [[CpNode]] representing the start vertex.
 * @param tolerance Tolerance given as the degrees difference of the unit 
 * direction vectors at the interface between curves. A tolerance of zero means
 * perfect smoothness is required.
 */
function getBranches(
		cpNode: CpNode, 
		tolerance: number = defaultTolerance): CpNode[][] {

	// Start from a leaf
	while (!cpNode.isFullyTerminating()) {
		cpNode = cpNode.next;
	}

	let branches: CpNode[][] = [];

	// Since the tree is unrooted we must iterate in all directions from the
	// given vertex.
	let cps = [cpNode.prevOnCircle];

	let branchCpNodes: CpNode[] = [];
	while (cps.length) {
		let cp = cps.pop();
		branchCpNodes.push(cp);

		let children = cp.getChildren();

		if (cp.isFullyTerminating()) {
			if (branchCpNodes.length > 1) {
				branches.push(branchCpNodes);
			}
			branchCpNodes = [];
			continue; 
		}

		if (children.length === 1) {
			cps.push(children[0]);
			continue;
		}

		children = children.filter(cpNode => !cpNode.isTerminating());

		if (children.length === 0) {
			branches.push(branchCpNodes);
			branchCpNodes = [];
			continue;
		}

		if (children.length > 1) {
			// More than one branch comes together
			branches.push(branchCpNodes);
			branchCpNodes = [];
			cps.push(...children);
			continue;
		}

		let backPointingTan = tangent(
			getCurveToNext(cp.next.prevOnCircle), 0
		);
		let forwardPointingTan = tangent(
			getCurveToNext(children[0]), 0
		);

		let cross_ = cross(backPointingTan, forwardPointingTan);
		let angle = Math.abs(Math.asin( cross_ ) * (180/Math.PI));

		if (angle > tolerance) {
			branches.push(branchCpNodes);
			branchCpNodes = [];
		}

		cps.push(children[0]);
	}

	if (branchCpNodes.length) { branches.push(branchCpNodes); }

	return branches;
}


export { getBranches }
