import { CpNode } from "../cp-node.js";
/**
 * Returns `true` if this `CpNode` is fully terminating, meaning that all
 * `CpNode`s (except `CpNode.prevOnCircle`) on the same circle are terminating,
 * `false` otherwise.
 *
 * @param cpNode
 */
declare function isFullyTerminating(cpNode: CpNode): boolean;
export { isFullyTerminating };
