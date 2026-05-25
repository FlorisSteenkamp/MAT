import { CpNode } from "../cp-node.js";
/**
 * Returns the number of contact points (up to planar coordinates) on the
 * maximal disk circle implied by this `CpNode`.
 *
 * See also `getProngCount`.
 */
declare function getRealProngCount(cpNode: CpNode): number;
export { getRealProngCount };
