import { isFullyTerminating } from '../cp-node/fs/is-fully-terminating.js';
import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';
/** @internal */
function getLeaves(cpNode) {
    const leaves = [];
    const cps = getAllOnLoop(cpNode);
    for (const cp of cps) {
        if (isFullyTerminating(cp) && !cp.isHoleClosing) {
            leaves.push(cp);
        }
    }
    return leaves;
}
export { getLeaves };
//# sourceMappingURL=get-leaves.js.map