import { MatNode } from '../../classes/mat-node';
/**
 * Apply the Scale Axis Transform (SAT) to the MAT.
 *
 * @param mat_ - The Medial Axis Transform (MAT) on which to apply the SAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
declare function toScaleAxis(mat_: MatNode, s: number): MatNode;
export { toScaleAxis };
