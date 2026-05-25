import type { CpNode } from "../cp-node.js";
import { getAllOnCircle } from "./get-all-on-circle.js";
import { isTerminating } from "./is-terminating.js";


/**
 * Like isTerminating() but only returns true if all cpNodes on the circle
 * (except this.prevOnCircle) is terminating.
 */
function isFullyTerminating(cpNode: CpNode) {
    const otherOnCircle = getAllOnCircle(cpNode.prevOnCircle, true);

    return otherOnCircle.every(isTerminating);
}


export { isFullyTerminating }
