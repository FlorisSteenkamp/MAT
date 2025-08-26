import { CpNode } from '../cp-node/cp-node.js';
import { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Finds and add a 3-prong MAT circle to the given shape.
 * @param cpTrees
 * @param visitedCps
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function findAndAdd3Prong(meta: MatMeta, visitedCps: CpNode[]): {
    closeBysFor3Prong: CpNode[];
    cpNodes: CpNode[];
};
export { findAndAdd3Prong };
