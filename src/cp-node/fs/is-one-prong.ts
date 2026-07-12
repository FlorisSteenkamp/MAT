import type { CpNode } from "../cp-node.js";
import { getRealProngCount } from "./get-real-prong-count.js";


/**
 * Returns true if this `CpNode`'s maximal disk has only one contact point
 * on the shape boundary (up to planar coordinates). These includes sharp 
 * corners.
 * 
 * Note, however, that two `CpNode`s are stored for each such point to
 * preserve symmetry - see `isTerminating` for more details.
 */
function isOneProng(cpNode: CpNode) {
    return getRealProngCount(cpNode) === 1 && !cpNode.isHoleClosing;
}


export { isOneProng }
