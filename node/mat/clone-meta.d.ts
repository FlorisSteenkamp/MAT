import type { MatMeta } from './mat-meta.js';
import type { CpNode } from '../cp-node/cp-node.js';
/**
 * Returns a clone of the given `MatMeta` for the given (already cloned)
 * `CpNode`, i.e. with `cpTrees` rebuilt from the clone and a fresh
 * `lastInsertId`.
 *
 * @param cpNode the (cloned) `CpNode` the meta is for
 * @param meta the `MatMeta` to clone
 */
declare function cloneMeta(cpNode: CpNode, meta: MatMeta): MatMeta;
export { cloneMeta };
