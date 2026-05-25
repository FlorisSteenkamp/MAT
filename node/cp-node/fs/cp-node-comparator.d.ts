import type { CpNode } from "../cp-node.js";
/**
 * Primarily for internal use.
 *
 * Compares the order of two `CpNode`s. The order is cyclic and depends
 * on a `CpNode`'s relative position along the shape boundary.
 */
declare function cpNodeComparator(a: CpNode, b: CpNode): number;
export { cpNodeComparator };
