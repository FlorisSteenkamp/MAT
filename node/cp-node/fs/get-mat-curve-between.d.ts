import type { CpNode } from '../cp-node.js';
/**
 * Returns the bezier curves (an array of 1 or 2 lines or quadratics joined
 * smoothly) from the maximal disk of one `CpNode` to another `CpNode`'s
 * maximal disk.
 *
 * @param cpNodeFrom
 * @param cpNodeTo
 */
declare function getMatCurveBetween(cpNodeFrom: CpNode, cpNodeTo: CpNode): number[][][];
export { getMatCurveBetween };
