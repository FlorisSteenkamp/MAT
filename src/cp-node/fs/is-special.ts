import type { CpNode } from "../cp-node.js";
import { getRealProngCount } from "./get-real-prong-count.js";


/**
 * Returns `true` if the given `CpNode` is on a 'special' MAT vertex, i.e. one
 * that is not a plain 2-prong: a leaf, a 3-prong (or higher) or a hole-closer.
 * 
 * * these are the vertices that must be kept when simplifying the MAT and
 *   the vertices of the MAT seen as a graph
 */
function isSpecial(cpNode: CpNode) {
    return (
        getRealProngCount(cpNode) !== 2 ||
        cpNode.isHoleClosing
    );
}


export { isSpecial }
