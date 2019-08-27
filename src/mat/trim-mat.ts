
import { Mat } from '../mat';
import { createNewCpTree } from './create-new-cp-tree';
import { cullNonCycles } from './to-scale-axis/cull-non-cycles';
import { clone } from '../cp-node/clone';


/**
 * Trims the given Medial Axis Transform so that only cycles remain. Similar to
 * toScaleAxis(mat, Number.POSITIVE_INFINITY).
 * @param mat The MAT to trim.
 */
function trimMat(mat: Mat) {
	let cpNode = cullNonCycles(clone(mat.cpNode));

    if (!cpNode) { return undefined; }

    let mat_ = new Mat(cpNode, createNewCpTree(cpNode));
    
    /*
    if (typeof _debug_ !== 'undefined') {
	    let generated = _debug_.generated;
        generated.elems.sat.push(mat_);
    }
    */

	return mat_;
}


export { trimMat };
