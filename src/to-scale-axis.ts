
/** @hidden */
declare var _debug_: MatDebug;

import { MatDebug } from './debug/debug';

import { length } from 'flo-bezier3';

import { CpNode } from './cp-node/cp-node';
import { Circle } from './circle';
import { Mat    } from './mat';
import { traverseEdges    } from './traverse-edges';
import { traverseVertices } from './traverse-vertices';
import { getLargestVertex } from './mat/get-largest-vertex';
import { createNewCpTree  } from './mat/create-new-cp-tree';
import { getLeaves        } from './mat/get-leaves';
import { cull             } from './mat/to-scale-axis/cull';
import { addDebugInfo     } from './mat/to-scale-axis/add-debug-info';
import { clone } from './cp-node/clone';
import { getCurveToNext } from './mat/smoothen/smoothen';
import { simplifyMat } from './mat/simplify-mat';


/*
function inverseScale(cpNode: CpNode, s: number) {
	let rMax = cpNode.cp.circle.radius;

	return function(r: number) {
		let s_ = 1 + (s-1)*((rMax+0.1)/(r+0.1));
		//console.log(s,s_,r)
		return s_*r;
	}
}
*/


function linearScale(cpNode: CpNode, s: number) {
	return function(r: number) {
		return s*r;
	}
}


let len = length([0,1]);


/**
 * Apply and returns an enhanced version of the Scale Axis Transform (SAT) to 
 * the given MAT. The returned SAT is guaranteed to be a subset of the MAT and 
 * preserves topology at any scale.
 * 
 * Typically the MAT contains too many branches caused by minute details on the
 * boundary of the shape. The SAT is a simplification of the MAT that preserves
 * less detail the higher the applied scale factor. The severity at which noise
 * are removed depends on the local scale of the shape.
 * @param mat The Medial Axis Transform ([[Mat]]) on which to apply the SAT. 
 * @param s The scale factor >= 1 (e.g. 1.3)
 */
function toScaleAxis(
		mat: Mat, 
		s: number, 
		f: (cpNode: CpNode, s: number) => (r: number) => number = linearScale) {

	if (typeof _debug_ !== 'undefined') {
		_debug_.generated.timing.sats[0] = performance.now();
		let leaves = getLeaves(mat.cpNode);
		_debug_.generated.elems.leaves.push(leaves);
	}

	/** The largest vertex (as measured by its inscribed disk) */
	let cpNodes: CpNode[] = [];
	traverseVertices(
		clone(mat.cpNode), 
		cpNode => { cpNodes.push(cpNode); }
	);

	let cpNode = getLargestVertex(cpNodes);
	let f_ = f(cpNode, s);

	if (typeof _debug_ !== 'undefined') {
		_debug_.generated.elems.maxVertex.push(cpNode);
	}

	/** 
	 * All vertices that are set to be culled initially. This may change later 
	 * in order to preserve topology. 
	 */
	let culls: Set<Circle> = new Set();

	let rMap: Map<CpNode,number> = new Map();

	traverseEdges(cpNode, function(cpNode) {
		/** The occulating radius stored with this vertex. */
		let R = rMap.get(cpNode) || f_(cpNode.cp.circle.radius);
		//let R = rMap.get(cpNode) || s * rThis;

		let cpNode_ = cpNode.next;

		//let c  = cpNode .cp.circle.center;
		//let c_ = cpNode_.cp.circle.center;
		/** Distance between this vertex and the next. */
		//let l = distanceBetween(c, c_); // Almost always precise enough
		//let l = len(cpNode.matCurveToNextVertex);
		let l = len(getCurveToNext(cpNode));

		let r = cpNode_.cp.circle.radius;
		//let s_ = 1 + (s-1)*(rMax/r);
		//let r_ = s * r;
		let r_ = f_(r);
		if (R - l > r_) {
			for (let cpNode of cpNode_.getCpNodesOnCircle()) {
				rMap.set(cpNode, R - l); // Update osculating radii
			}
			culls.add(cpNode_.cp.circle);
		}
	});

	cull(culls, cpNode);

	if (typeof _debug_ !== 'undefined') {
		_debug_.generated.elems.culls.push(Array.from(culls));
	}
	 
	let sat = new Mat(cpNode, createNewCpTree(cpNode));

	addDebugInfo(sat);

	return sat;
}


export { toScaleAxis }
