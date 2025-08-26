import { CpNode } from '../cp-node/cp-node.js';
import { DualSet } from '../utils/dual-set.js';
/**
 * @internal
 * Returns the set of Vertices passing the following test: walk the MAT tree and
 * keep all Vertices not in the current cull set and any Vertices that have a
 * non-culled node further down the line toward the tree leaves.
 * @param culls The CpNodes (referred to by circles) that should be culled.
 * @param maxCpNode The start CpNode which must reprsesent the maximal vertex.
 */
declare function cull(culls: DualSet<number, number>, maxCpNode: CpNode): void;
export { cull };
