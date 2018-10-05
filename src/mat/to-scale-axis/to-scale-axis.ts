
declare var _debug_: MatDebug;

import { MatDebug } from '../../debug/debug';

import { len } from 'flo-bezier3';

import { distanceBetween } from 'flo-vector2d';

import { CpNode } from '../../cp-node';
import { Circle } from '../../circle';
import { Mat    } from '../../mat';

import { traverseEdges    } from '../traverse-edges';
import { traverseVertices } from '../traverse-vertices';
import { smoothen         } from '../smoothen/smoothen';

import { getLargestVertex } from '../get-largest-vertex';
import { cull             } from './cull';
import { createNewCpTree  } from '../create-new-cp-tree';
import { addDebugInfo     } from './add-debug-info';
import { getLeaves } from '../get-leaves';


/**
 * Apply an enhanced version of the Scale Axis Transform (SAT) to the MAT.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT. 
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
function toScaleAxis(mat: Mat, s: number) {
	if (typeof _debug_ !== 'undefined') {
		_debug_.generated.timing.sats[0] = performance.now();
		let leaves = getLeaves(mat.cpNode);
		_debug_.generated.elems.leaves.push(leaves);
	}

	/** The largest vertex (as measured by its inscribed disk) */
	let cpNode = getLargestVertex(
		traverseVertices(mat.cpNode.clone())
	);

	if (typeof _debug_ !== 'undefined') {
		_debug_.generated.elems.maxVertex.push(cpNode);
	}

	/** 
	 * All vertices that are set to be culled initially. This may change to 
	 * preserve topology. 
	 */
	let culls: Set<Circle> = new Set();

	let rMap: Map<CpNode,number> = new Map();

	traverseEdges(cpNode, function(cpNode) {
		/** The occulating radius stored with this vertex. */
		let R = rMap.get(cpNode) || s * cpNode.cp.circle.radius;

		let cpNode_ = cpNode.next;

		//let c  = cpNode .cp.circle.center;
		//let c_ = cpNode_.cp.circle.center;
		/** Distance between this vertex and the next. */
		//let l = distanceBetween(c, c_); // Almost always precise enough
		let l = len([0,1], cpNode.matCurve);

		let r_ = s * cpNode_.cp.circle.radius;
		if (R - l > r_) {
			for (let cpNode of cpNode_.getNodes()) {
				rMap.set(cpNode, R - l); // Update occulating radii
			}
			culls.add(cpNode_.cp.circle);
		}
	});

	cull(culls, cpNode);

	if (typeof _debug_ !== 'undefined') {
		_debug_.generated.elems.culls.push(Array.from(culls));
	}
	 
	smoothen(cpNode);

	let sat = new Mat(cpNode, createNewCpTree(cpNode));

	addDebugInfo(sat);

	return sat;
}


export { toScaleAxis }
