import { isFullyTerminating } from './is-fully-terminating.js';
/**
 * In-place removes trivial 3-prongs from the SAT graph; just to simplify
 * subsequent processing.
 *
 * These are 3-prongs that are induced by the SAT construction, and do
 * not correspond to actual 3-prongs in the shape.
 *
 * @param sat the SAT
 */
function removeSatInducedTrivial3Prongs(sat) {
    let { cpNode } = sat;
    let cpStart = cpNode;
    do {
        if (isFullyTerminating(cpNode) ||
            // cpNode.isHoleClosing ||  // hole-closers are fully terminating
            cpNode.next !== cpNode.nextOnCircle) {
            cpNode = cpNode.next;
            continue;
        }
        //-----------------------------
        // Delete the trivial 3-prong
        //-----------------------------
        // console.log('Removing SAT-induced trivial 3-prong');
        const next = cpNode.next;
        const nextNext = next.next;
        const nextNextOC = cpNode.next.nextOnCircle;
        //-------------------------------------------------------------
        // In-place update of links to remove the trivial 3-prong node
        //-------------------------------------------------------------
        cpNode.next = nextNext;
        cpNode.nextOnCircle = nextNextOC;
        nextNext.prev = cpNode;
        nextNextOC.prevOnCircle = cpNode;
        //-------------------------------------------------------------
        if (cpStart === next) {
            cpStart = cpNode; // ...otherwise the loop will never terminate
        }
        cpNode = cpNode.next;
    } while (cpNode !== cpStart);
    // ...otherwise the caller will have a reference to a node that has been removed from the graph
    sat.cpNode = cpNode;
    return sat;
}
export { removeSatInducedTrivial3Prongs };
//# sourceMappingURL=remove-sat-induced-trivial-3prongs.js.map