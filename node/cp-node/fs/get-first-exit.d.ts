import type { CpNode } from "../cp-node.js";
/**
 * Returns the first `CpNode` *after* the given one (by successively applying
 * `.nextOnCircle`) that exits the circle, i.e. the first one that is not
 * terminating - the given `CpNode` itself is never returned.
 *
 * * returns `undefined` if no other `CpNode` on the circle exits (e.g. the
 *   other `CpNode` of a 1-prong, or the MAT is a single point)
 */
declare function getFirstExit(cpNode: CpNode): CpNode | undefined;
export { getFirstExit };
