import type { CpNode } from "../cp-node.js";
/**
 * Like isTerminating() but only returns true if all cpNodes on the circle
 * (except this.prevOnCircle) is terminating.
 */
declare function isFullyTerminating(cpNode: CpNode): boolean;
export { isFullyTerminating };
