import { CpNode } from '../cp-node.js';
/**
 * Returns the (flattened) array of bezier curves (lines or quadratics)
 * representing the medial axis from one `CpNode` to another by following
 * `next` repeatedly.
 *
 * @param cpNodeS
 * @param cpNodeE
 */
declare function getMatCurvesBetween(cpNodeS: CpNode, cpNodeE: CpNode): number[][][];
export { getMatCurvesBetween };
