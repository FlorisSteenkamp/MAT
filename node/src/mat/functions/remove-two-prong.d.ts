import { CpNode } from '../../linked-list/cp-node';
/**
 * Removes the 2-prong connected to the given ContactPoint.
 *
 * This is used for example when a 2-prong and 3-prong falls on top of each
 * other causing the algorithm to fail.
 * @param cpNode
 */
declare function removeTwoProng(cpNode: CpNode): void;
export { removeTwoProng };
