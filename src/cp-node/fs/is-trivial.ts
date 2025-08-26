import { CpNode } from "../cp-node.js";
import { getAllOnCircle } from "./get-all-on-circle.js";
import { isTerminating } from "./is-terminating.js";


/**
 * Returns `true` if the `CpNode` has all branches terminating
 */
function isTrivial(
        cpNode: CpNode) {

    return getAllOnCircle(cpNode).every(isTerminating);
}


export { isTrivial }
