import type { CpNode } from "../cp-node.js";
/**
 * Like `isTerminating` but only returns `true` if all `CpNode`s on the circle
 * (except possibly the one leading back, i.e. `this.prevOnCircle`) are
 * terminating - i.e. the `CpNode` is terminating and its vertex has at most
 * one real prong.
 */
declare function isFullyTerminating(cpNode: CpNode): boolean;
export { isFullyTerminating };
