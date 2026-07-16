import type { CpNode } from '../cp-node/cp-node.js';
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * Find and add two-prongs that close any holes in the shape.
 *
 * @param meta
 *
 * @internal
 */
declare function findAndAddHoleClosing2Prongs(meta: MatMeta): CpNode | undefined;
export { findAndAddHoleClosing2Prongs };
