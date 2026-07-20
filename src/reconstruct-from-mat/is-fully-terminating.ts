import type { CpNode } from '../cp-node/cp-node.js';
import { getAllOnCircle } from '../cp-node/fs/get-all-on-circle.js';
import { isTerminating } from '../cp-node/fs/is-terminating.js';
import { isTrivial } from '../cp-node/fs/is-trivial.js';


// TODO - DUPLICATE! -> likely other version needs fixing
function isFullyTerminating(cpNode: CpNode) {
    if (!isTerminating(cpNode)) {
        return false;
    }

    if (isTrivial(cpNode)) {
        return true;
    }

    while (cpNode.prev === cpNode.prevOnCircle) {
        cpNode = cpNode.prev;
    }

    const otherOnCircle = getAllOnCircle(cpNode.prevOnCircle, true);

    return otherOnCircle.every(isTerminating);
}


export { isFullyTerminating }
