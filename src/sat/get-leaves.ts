import { CpNode } from '../cp-node/cp-node.js';
import { CpNodeFs } from '../cp-node/cp-node-fs.js';
import { isFullyTerminating } from '../cp-node/fs/is-fully-terminating.js';
import { getRealProngCount } from '../cp-node/fs/get-real-prong-count.js';

const { getAllOnLoop } = CpNodeFs;


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
