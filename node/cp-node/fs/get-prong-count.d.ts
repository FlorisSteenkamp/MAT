import { CpNode } from "../cp-node.js";
/**
 * Returns the number of contact points on the maximal disk circle implied
 * by this `CpNode`.
 *
 * Note, however, that even one-prongs and sharp corners will return 2 (see
 * `isTerminating` for more details); if this is not desired use
 * `getRealProngCount` instead which will return 1 in these cases.
 */
declare function getProngCount(cpNode: CpNode): number;
export { getProngCount };
