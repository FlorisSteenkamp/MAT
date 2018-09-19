import { CpNode } from '../../../linked-list/cp-node';
/**
 * Apply the Scale Axis Transform (SAT) to the MAT.
 * @param cpNode - The Medial Axis Transform (MAT) on which to apply the SAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
declare function toScaleAxis(cpNode: CpNode, s: number): CpNode;
export { toScaleAxis };
