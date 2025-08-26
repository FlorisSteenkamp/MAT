import { CpNode } from '../cp-node/cp-node.js';
import { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Find and add two-prongs that remove any holes in the shape.
 * @param loops The loops (that as a precondition must be ordered from
 * highest (i.e. smallest y-value) topmost point loops to lowest)
 * @param cpTrees
 * @param maxCoordinate The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function findAndAddHoleClosing2Prongs(meta: MatMeta): CpNode | undefined;
export { findAndAddHoleClosing2Prongs };
