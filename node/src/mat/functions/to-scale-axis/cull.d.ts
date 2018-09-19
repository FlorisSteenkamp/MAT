import { Circle } from '../../classes/circle';
import { CpNode } from '../../../linked-list/cp-node';
/**
 * Returns the set Vertices passing the following test: walk the MAT tree and
 * keep all Vertices not in the current cull set and any Vertices that have a
 * non-culled node further down the line toward the tree leaves.
 * @param cullls
 * @param cpNode
 */
declare function cull(culls: Set<Circle>, cpNode: CpNode): void;
export { cull };
