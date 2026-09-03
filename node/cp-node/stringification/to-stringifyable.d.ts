import type { CpNodeStringifyable } from "./cp-node-stringifyable.js";
import type { CpNode } from "../cp-node.js";
/**
 * Returns a deep clone of this `CpNode`. Can be used to copy the MAT
 * since cloning a single `CpNode` necessarily implies cloning all
 * `CpNode`s on the same MAT tree.
 */
declare function toStringifyable(cpNode: CpNode): CpNodeStringifyable;
export { toStringifyable };
