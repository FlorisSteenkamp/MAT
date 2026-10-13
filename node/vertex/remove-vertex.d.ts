import type { CpNode } from "../cp-node/cp-node.js";
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * Removes the (2-prong) vertex represented by the given `CpNode` from the MAT,
 * i.e. both `CpNode`s on its circle are unlinked from the boundary and removed
 * from `meta.cpTrees`.
 *
 * @param cpNode a `CpNode` on the vertex to remove
 * @param meta the `MatMeta` whose `cpTrees` hold the `CpNode`s of the MAT
 */
declare function removeVertex(cpNode: CpNode, meta: MatMeta): void;
export { removeVertex };
