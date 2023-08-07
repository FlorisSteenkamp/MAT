/** @internal */
declare const _debug_: Debug;

import { length } from 'flo-bezier3';
import { Debug } from '../debug/debug.js';
import { CpNode, getCpNodesOnCircle } from '../cp-node/cp-node.js';
import { Circle } from '../geometry/circle.js';
import { Mat } from '../mat/mat.js';
import { traverseEdges } from '../cp-node/traverse-edges.js';
import { traverseVertices } from '../cp-node/traverse-vertices.js';
import { getLargestVertex } from '../mat/get-largest-vertex.js';
import { createNewCpTree } from '../mat/create-new-cp-tree.js';
import { getLeaves } from './get-leaves.js';
import { cull } from './cull.js';
import { addDebugInfo } from './add-debug-info.js';
import { clone } from '../cp-node/clone.js';
import { getCurveToNext } from '../cp-node/get-curve-to-next.js';


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
		s: number): Mat {

	let timingStart = 0;
	if (typeof _debug_ !== 'undefined') {
		timingStart = performance.now();
		const leaves = getLeaves(mat.cpNode);
		_debug_.generated.elems.leaves.push(leaves);
	}

	/** The largest vertex (as measured by its inscribed disk) */
	const cpNodes: CpNode[] = [];
	traverseVertices(
		clone(mat.cpNode), 
		cpNode => { cpNodes.push(cpNode); }
	);

	const cpNode = getLargestVertex(cpNodes);
	// console.log(cpNodes.map(c => c.cp.circle.radius).length)

	if (typeof _debug_ !== 'undefined') {
		_debug_.generated.elems.maxVertex.push(cpNode);
	}

	/** 
	 * All vertices that are set to be culled initially. This may change later 
	 * in order to preserve topology. 
	 */
	const culls: Set<Circle> = new Set();

	const rMap: Map<CpNode,number> = new Map();

	traverseEdges(cpNode, function(cpNode) {
		/** The occulating radius stored with this vertex. */
		const R = rMap.get(cpNode) || (s*cpNode.cp.circle.radius);

		const cpNode_ = cpNode.next;

		const l = length([0,1], getCurveToNext(cpNode));

		const r = cpNode_.cp.circle.radius;
		const r_ = s*r;
		if (R - l > r_) {
			for (const cpNode of getCpNodesOnCircle(cpNode_)) {
				rMap.set(cpNode, R - l); // Update osculating radii
			}
			culls.add(cpNode_.cp.circle);
		}
	});

	cull(culls, cpNode);

	if (typeof _debug_ !== 'undefined') {
		_debug_.generated.elems.culls.push(Array.from(culls));
	}
	 
	// TODO - put line below back - goes into infinite loop
	//const sat: Mat = { cpNode, cpTrees: createNewCpTree(cpNode) };
	const sat: Mat = { cpNode, cpTrees: undefined! };

	addDebugInfo(sat, timingStart);

	return sat;
}


export { toScaleAxis }
