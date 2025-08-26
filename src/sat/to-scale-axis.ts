/** @internal */
declare const _debug_: Debug;

import { Debug } from '../debug/debug.js';
import { Mat } from '../mat/mat.js';
import { getLargestVertex } from '../mat/get-largest-vertex.js';
import { createNewCpTree } from '../mat/create-new-cp-tree.js';
import { cull } from './cull.js';
import { addDebugInfo } from './add-debug-info.js';
import { clone } from '../cp-node/fs/clone.js';
import { getSatCulls } from './get-sat-culls.js';


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
	}

	const cpNode = getLargestVertex(clone(mat.cpNode));
	const culls = getSatCulls(cpNode, s);

	cull(culls, cpNode);

	const sat: Mat = {
        cpNode: cpNode,
        meta: {
            ...mat.meta,
			cpTrees: createNewCpTree(cpNode)
        }
    };


	addDebugInfo(timingStart);

	return sat;
}


export { toScaleAxis }
