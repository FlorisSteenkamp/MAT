
declare var _debug_: MatDebug;

import { MatDebug } from '../../debug/debug';

import { distanceBetween } from 'flo-vector2d';

import { CpNode } from '../../cp-node';
import { Circle } from '../../circle';
import { Mat    } from '../../mat';

import { traverseEdges      } from '../traverse-edges';
import { getVerticesAsArray } from '../get-vertices-as-array';

import { getLargestVertex } from './get-largest-vertex';
import { cull             } from './cull';
import { createNewCpTree  } from './create-new-cp-tree';
import { addDebugInfo     } from './add-debug-info';
import { smoothen } from '../smoothen/smoothen';


/**
 * Apply an enhanced version of the Scale Axis Transform (SAT) to the MAT.
 * @param mat - The Medial Axis Transform (MAT) on which to apply the SAT. 
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
function toEnhancedScaleAxis(mat: Mat, s: number) {
	if (typeof _debug_ !== 'undefined') {
		_debug_.generated.timing.sats[0] = performance.now();
	}

	let cpNodes = getVerticesAsArray(mat.cpNode.clone()); 
	let cpNode = getLargestVertex(cpNodes);

	let culls: Set<Circle> = new Set();
	let rMap: Map<CpNode,number> = new Map();

	traverseEdges(cpNode, function(cpNode) {
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
	 
	smoothen(cpNode);

	addDebugInfo(cpNode);

	return new Mat(cpNode, createNewCpTree(cpNode));
	
}


export { toEnhancedScaleAxis }
