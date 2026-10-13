import type { CpNodeStringifyable } from "./cp-node-stringifyable.js";
import type { CpNode } from "../cp-node.js";
/**
 * Returns a plain, acyclic representation of the entire MAT the given `CpNode`
 * is part of (the `CpNode` edges replaced by ids and the boundary loops
 * included) suitable for `JSON.stringify`; `fromStringifyable` reverses it.
 */
declare function toStringifyable(cpNode: CpNode): CpNodeStringifyable;
export { toStringifyable };
