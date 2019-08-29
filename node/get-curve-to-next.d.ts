import { CpNode } from "./cp-node";
/**
 * Returns the bezier curve from the maximal disk of the given [[CpNode]] to the
 * next [[CpNode]]'s maximal disk and thus directly represents a piece of the
 * medial axis.
 * @param cpNode
 */
declare function getCurveToNext(cpNode: CpNode): number[][];
export { getCurveToNext };
