import { Mat } from './mat.js';
import { createNewCpTree } from './create-new-cp-tree.js';
import { cullNonCycles } from '../sat/cull-non-cycles.js';
import { clone } from '../cp-node/fs/clone.js';


/**
 * Trims the given Medial Axis Transform so that only cycles remain. Similar to
 * toScaleAxis(mat, Number.POSITIVE_INFINITY).
 * @param mat The MAT to trim.
 */
function trimMat(mat: Mat): Mat {
	const cpNode = cullNonCycles(clone(mat.cpNode));

    if (!cpNode) { return undefined!; }

    return {
        cpNode,
        meta: {
            ...mat.meta,
            cpTrees: createNewCpTree(cpNode)
        }
    }
}


export { trimMat };
