import { createNewCpTrees } from './create-new-cp-trees.js';
import { cullNonCycles } from '../sat/cull-non-cycles.js';
import { clone } from '../cp-node/fs/clone.js';
/**
 * Trims the given Medial Axis Transform so that only cycles remain. Similar to
 * toScaleAxis(mat, Infinity).
 *
 * * returns `undefined` if the MAT has no cycles (i.e. the shape has no holes)
 *
 * @param mat The MAT to trim (it is not modified).
 */
function trimMat(mat) {
    // FUTURE - clone entire `Mat` instead (the function already exists)
    const cpNode = cullNonCycles(clone(mat.cpNode));
    if (!cpNode) {
        return undefined;
    }
    return {
        cpNode,
        meta: {
            ...mat.meta,
            cpTrees: createNewCpTrees(cpNode)
        }
    };
}
export { trimMat };
//# sourceMappingURL=trim-mat.js.map