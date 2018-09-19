
// TODO - not finished - don't use!

declare var _debug_: MatDebug; 

import { MatDebug } from '../../debug/debug';

import { distanceBetween } from 'flo-vector2d';

import { CpNode } from '../../cp-node';
import { Circle } from '../../circle';
import { Mat    } from '../../mat';

import { traverseEdges      } from '../traverse-edges';
//import { traverseEdges_     } from '../traverse-edges';
import { getVerticesAsArray } from '../get-vertices-as-array';

import { getLargestVertex } from './get-largest-vertex';
import { cull             } from './cull';
import { createNewCpTree  } from './create-new-cp-tree';
import { addDebugInfo     } from './add-debug-info';


/**
 * TODO - to be finished - don't use!
 * Apply an enhanced version of the Scale Axis Transform (SAT) to the MAT 
 * without pre-specifying the scale. An ordered array of SAT's are returned, 
 * such that each consecutive SAT has an additional branch snipped. The scale
 * for each SAT is also returned.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT. 
 */
function toSpectrumScaleAxis(mat: Mat, s: number) {
	let cpNodes = getVerticesAsArray(mat.cpNode.clone()); 
	let cpNode = getLargestVertex(cpNodes);

	let culls: Set<Circle> = new Set();
    let rMap: Map<CpNode,number> = new Map();
	
	let i = 0;
	
	traverseEdges_(cpNode, function(cpNode) {
		i++;
		let p1 = cpNode     .cp.circle.center;
		let p2 = cpNode.next.cp.circle.center;
       	//_debug_.fs.draw.line([p1, p2], "thin10 red nofill", i*100);

		let r = rMap.get(cpNode);
		let R = r ? r : s * cpNode.cp.circle.radius;

		let cpNodes = cpNode.getCps();

		for (let cpNode of cpNodes) {
			let cpNode_ = cpNode.next;

			// TODO - l should really be the bezier length connecting the mat 
			// circle centers and not the straight line length.
			let center_ = cpNode_.cp.circle.center;
			let center  = cpNode .cp.circle.center;
			let l = distanceBetween(center, center_);

			let r_ = s * cpNode_.cp.circle.radius;
			if (R > l + r_) {
				rMap.set(cpNode_, R - l);
				culls.add(cpNode_.cp.circle);
			}
		}
	});

	cull(culls, cpNode);
	 
	addDebugInfo(cpNode);
	
	return new Mat(cpNode, createNewCpTree(cpNode));
}


/**
 * Traverses all edges (depth first) of a MAT starting at the given vertex.
 * @param cpNode The contact point representing the start vertex
 * @param f A callback function for each cpNode representing the start of and 
 * edge.
 */
function traverseEdges_(
		cpNode: CpNode,
		f: (cp: CpNode, isLeaf: boolean) => void,
		inclLeaves: boolean = false) {

	let cps = cpNode.getCps();

	while (cps.length) {
		let cp = cps.pop();

		while (!cp.isTerminating()) {
			f(cp, false);

			cp = cp.next;

			if (cp.isThreeProng()) {
				cps.push(cp.nextOnCircle); 
			}
		}

		if (inclLeaves) {
			f(cp, true);
		}
	}
}

export { toSpectrumScaleAxis }
