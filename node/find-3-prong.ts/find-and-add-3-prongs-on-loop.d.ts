import { CpNode } from '../cp-node/cp-node.js';
import { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Finds and adds all 3-prongs on a loop.
 *
 * @param meta
 * @param cpStart The CpNode to start traversing from.
  */
declare function findAndAdd3ProngsOnLoop(meta: MatMeta, cpStart: CpNode | undefined): CpNode | undefined;
export { findAndAdd3ProngsOnLoop };
