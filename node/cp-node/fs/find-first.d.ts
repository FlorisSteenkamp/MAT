import type { CpNode } from "../cp-node.js";
/**
 * Finds the first `CpNode` in the same MAT tree for which `f` returns a
 * truthy value. Returns `undefined` if no such `CpNode` exists.
 *
 * @param f a function that takes a `CpNode` and returns a `CpNode` or `undefined`
 * @param cpNode a `CpNode` on the MAT tree to search from
 */
declare function findFirst(f: (cpNode: CpNode) => boolean, cpNode: CpNode): CpNode | undefined;
export { findFirst };
