import type { CpNode } from "../cp-node.js";
import { getAllOnCircle } from "./get-all-on-circle.js";
import { isTerminating } from "./is-terminating.js";


/**
 * Returns `true` if this `CpNode` is fully terminating, meaning that all
 * `CpNode`s (except `CpNode.prevOnCircle`) on the same circle are terminating,
 * `false` otherwise.
 * 
 * @param cpNode 
 */
function isFullyTerminating(cpNode: CpNode) {
    const otherOnCircle = getAllOnCircle(cpNode.prevOnCircle, true);

    return otherOnCircle.every(isTerminating);
}


export { isFullyTerminating }
