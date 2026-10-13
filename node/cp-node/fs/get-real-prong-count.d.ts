import { CpNode } from "../cp-node.js";
/**
 * Returns the number of contact points (up to planar coordinates) on the
 * maximal disk circle implied by this `CpNode`, i.e. the number of
 * non-terminating `CpNode`s on its circle.
 *
 * See also `getProngCount`.
 */
declare function getRealProngCount(cpNode: CpNode): number;
export { getRealProngCount };
