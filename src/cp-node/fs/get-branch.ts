import { CpNode } from '../cp-node.js';
import { getRealProngCount } from './get-real-prong-count.js';
import { isFullyTerminating } from './is-fully-terminating.js';
import { isTerminating } from './is-terminating.js';
import { isTrivial } from './is-trivial.js';


/**
 * Returns the branch associated with the give cpNode.
 * 
 * * the final `CpNode` is not returned to improve symmetry
 * 
 * @param cpNode `CpNode` representing the start vertex.
 */
function getBranch(
		cpNode: CpNode): CpNode[] {

    if (isTrivial(cpNode)) {
        return [];
    }

    // Start from a leaf or 3-prong
    while (isTerminating(cpNode)) {
        cpNode = cpNode.nextOnCircle;
    }

    cpNode = cpNode.next;
    while (getRealProngCount(cpNode) === 2) {
        cpNode = cpNode.next;
    }
    cpNode = cpNode.prevOnCircle;

    const branch: CpNode[] = [];
    do {
        branch.push(cpNode);
        cpNode = cpNode.next;
    } while (!isFullyTerminating(cpNode) && getRealProngCount(cpNode) === 2)

    return branch;
}


export { getBranch }
