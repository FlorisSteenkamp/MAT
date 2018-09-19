import { MatNode } from '../../classes/mat-node';
/**
 * Returns the Axis Measure Scale Axis Transform (AMSAT) of the Medial Axis
 * Transform (MAT). Unlike the Scale Axis Transform (SAT) the AMSAT is a subset
 * of the MAT.
 * @param mat_ - The Medial Axis Transform (MAT) on which to apply the AMSAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
declare function toAMScaleAxis(mat_: MatNode, s: number): MatNode;
export { toAMScaleAxis };
