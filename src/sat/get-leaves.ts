import type { CpNode } from '../cp-node/cp-node.js';
import { isFullyTerminating } from '../cp-node/fs/is-fully-terminating.js';
import { getAllOnLoop } from '../cp-node/fs/get-all-on-loop.js';


/** @internal */
function getLeaves(cpNode: CpNode) {
    const leaves: CpNode[] = [];

    const cps = getAllOnLoop(cpNode);
    for (const cp of cps) {
        if (isFullyTerminating(cp) && !cp.isHoleClosing) { 
            leaves.push(cp);
        }
    }

    return leaves;
}


export { getLeaves }
