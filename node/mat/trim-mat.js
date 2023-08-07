import { createNewCpTree } from './create-new-cp-tree.js';
import { cullNonCycles } from '../sat/cull-non-cycles.js';
import { clone } from '../cp-node/clone.js';
/**
 * Trims the given Medial Axis Transform so that only cycles remain. Similar to
 * toScaleAxis(mat, Number.POSITIVE_INFINITY).
 * @param mat The MAT to trim.
 */
function trimMat(mat) {
    const cpNode = cullNonCycles(clone(mat.cpNode));
    if (!cpNode) {
        return undefined;
    }
    return { cpNode, cpTrees: createNewCpTree(cpNode) };
}
export { trimMat };
//# sourceMappingURL=trim-mat.js.map