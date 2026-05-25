import type { CpNode } from "../cp-node.js";


/**
 * Returns `true` if this `CpNode` is terminating, i.e. implies a leaf MAT
 * vertex.
 * 
 * The following are some instances where this is the case:
 * 
 * * Sharp corners.
 * 
 * * Half of Hole-closers, i.e. `CpNode`s whose next `CpNode` is on a different
 * loop
 * 
 * * Maximal disks with a single contact point. 
 *   Note, however, that even in these cases there are two contact points stored
 *   (sitting 'on top' of each other) for the maximal disk. It can be seen as a
 *   limiting case of a two-prong where the distance between two of the contact
 *   points tend to zero. One point (represented by a `CpNode` of course) will
 *   be terminating with the other point being its `next`, whereas the other
 *   point will *not* be terminating and 'points' back into the shape.
 * 
 * * Some 3-prongs may also become terminating if the Scale Axis Transform is
 * applied to the shape.
 */
function isTerminating(cpNode: CpNode) {
    return cpNode === cpNode.next.prevOnCircle;
}


export { isTerminating }
