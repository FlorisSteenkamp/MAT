import type { CpNode } from '../cp-node/cp-node.js';
import type { Loop } from 'flo-boolean';
import type { MatOptions } from './mat-options.js';
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Find the MAT of the given loops.
 * @param loops The loops (that as a precondition must be ordered from highest
 * (i.e. smallest y-value) topmost point loops to lowest)
 */
declare function findMat(loops: Loop[], maxCoordPowerOf2: number, options: Required<MatOptions>): {
    cpNode: CpNode;
    meta: MatMeta;
};
export { findMat };
/** Curvilinear Shape Features (CSFs) */
