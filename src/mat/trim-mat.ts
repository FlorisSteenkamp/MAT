import type { Mat } from './mat.js';
import { createNewCpTrees } from './create-new-cp-trees.js';
import { cullNonCycles } from '../sat/cull-non-cycles.js';
import { clone } from '../cp-node/fs/clone.js';


/**
 * Trims the given Medial Axis Transform so that only cycles remain. Similar to
 * toScaleAxis(mat, Infinity).
 * 
 * @param mat The MAT to trim.
 */
function trimMat(mat: Mat): Mat {
    // FUTURE - clone entire `Mat` instead (the function already exists)
    const cpNode = cullNonCycles(clone(mat.cpNode));

    if (!cpNode) { return undefined!; }

    return {
        cpNode,
        meta: {
            ...mat.meta,
            cpTrees: createNewCpTrees(cpNode)
        }
    }
}


export { trimMat };
