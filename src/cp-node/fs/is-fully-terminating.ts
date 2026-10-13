import type { CpNode } from "../cp-node.js";
import { getRealProngCount } from "./get-real-prong-count.js";
import { isTerminating } from "./is-terminating.js";


/**
 * Like `isTerminating` but only returns `true` if all `CpNode`s on the circle
 * (except possibly the one leading back, i.e. `this.prevOnCircle`) are
 * terminating - i.e. the `CpNode` is terminating and its vertex has at most
 * one real prong.
 */
function isFullyTerminating(cpNode: CpNode) {
    return isTerminating(cpNode) && getRealProngCount(cpNode) <= 1;
}


export { isFullyTerminating }
