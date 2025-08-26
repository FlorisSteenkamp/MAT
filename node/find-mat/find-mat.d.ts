import { CpNode } from '../cp-node/cp-node.js';
import { Loop } from 'flo-boolean';
import { MatOptions } from './mat-options.js';
/**
 * @internal
 * Find the MAT of the given loops.
 * @param loops The loops (that as a precondition must be ordered from highest
 * (i.e. smallest y-value) topmost point loops to lowest)
 */
declare function findMat(loops: Loop[], maxCoordinate: number, options: Required<MatOptions>): {
    cpNode: CpNode;
    meta: import("../index.js").MatMeta;
};
export { findMat };
/** Curvilinear Shape Features (CSFs) */
