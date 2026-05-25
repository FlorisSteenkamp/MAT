import type { CpNode } from "../cp-node/cp-node.js";
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * Removes a cpNode from the MAT.
 * @param cpTree The tree graph holding the `CpNodes` of the MAT.
 * @param cpNode The `CpNode` to remove.
 */
declare function removeVertex(cpNode: CpNode, meta: MatMeta): void;
export { removeVertex };
