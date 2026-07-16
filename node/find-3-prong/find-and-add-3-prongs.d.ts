import { CpNode } from '../cp-node/cp-node.js';
import { MatMeta } from '../mat/mat-meta.js';
/**
  * Starting from some `CpNode`, traverses the shape going around Vertices
 * and if more than two Vertices have been visited in total then recursively
 * adds 3-prongs until only one or two Vertices have been visited.
 *
 * This process further subdivides the shape.
 *
 * @param cpTrees
 * @param cpStart The ContactPoint from where to start the process.
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 *
 * @internal
 */
declare function findAndAdd3Prongs(meta: MatMeta, cpStart: CpNode): {
    closeBysFor3Prong: CpNode[];
    addedCpNodes: CpNode[][];
} | {
    closeBysFor3Prong: undefined;
    addedCpNodes: CpNode[][];
};
export { findAndAdd3Prongs };
