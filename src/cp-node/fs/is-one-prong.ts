import { CpNode } from "../cp-node.js";


/**
 * Returns true if this `CpNode`'s maximal disk has only one contact point
 * on the shape boundary (up to planar coordinates). These includes sharp 
 * corners.
 * 
 * Note, however, that two `CpNode`s are stored for each such point to
 * preserve symmetry - see `isTerminating` for more details.
 */
// TODO2 - remove - or replace with `getRealProngCount === 1`
function isOneProng(cpNode: CpNode) {
    const cp1 = cpNode;

    if (cp1.cp.circle.radius === 0) {
        return true;
    }

    const cp2 = cp1.nextOnCircle;

    const p1 = cp1.cp.pointOnShape.p;
    const p2 = cp2.cp.pointOnShape.p;

    return (p1[0] === p2[0] && p1[1] === p2[1]);
}


export { isOneProng }
