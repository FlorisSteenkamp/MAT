import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';
import { getRealProngCount } from '../cp-node/fs/get-real-prong-count.js';
import { getLargestOf } from './get-largest-vertex.js';
/**
 * Returns the `CpNode` on a 3-prong (or higher) MAT vertex with the largest
 * maximal disk radius, or `undefined` if there is none.
 *
 * @param cpNode any `CpNode` on the MAT
 */
function getLargest3Prong(cpNode) {
    const cpNodes = getAllOnLoop(cpNode)
        .filter(cpNode => getRealProngCount(cpNode) >= 3);
    if (cpNodes.length === 0) {
        return undefined;
    }
    return getLargestOf(cpNodes);
}
export { getLargest3Prong };
//# sourceMappingURL=get-largest-3-prong.js.map