import { CpNode } from "../cp-node.js";
/**
 * Returns the first `CpNode` (from this one by successively applying
 * .nextOnCircle) that exits the circle.
 */
declare function getFirstExit(cpNode: CpNode): CpNode | undefined;
export { getFirstExit };
