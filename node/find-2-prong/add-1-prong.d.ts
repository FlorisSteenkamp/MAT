import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * @hidden
 * Add a 1-prong to the MAT.
 * @param cpTrees
 * @param pos
 */
declare function add1Prong(meta: MatMeta, radius: number, center: number[], pos: PrePointOnShape): void;
export { add1Prong };
