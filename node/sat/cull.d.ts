import type { CpNode } from '../cp-node/cp-node.js';
import type { DualSet } from '../utils/dual-set.js';
/**
 * Returns the set of Vertices passing the following test: walk the MAT tree and
 * keep all Vertices not in the current cull set and any Vertices that have a
 * non-culled node further down the line toward the tree leaves.
 *
 * @param culls the `CpNode`s (referred to by circles) that should be culled
 * @param maxCpNode the start `CpNode` which must represent the maximal vertex
 *
 * @internal
 */
declare function cull(culls: DualSet<number, number>, maxCpNode: CpNode): void;
export { cull };
