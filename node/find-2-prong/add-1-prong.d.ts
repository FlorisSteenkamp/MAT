import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { MatMeta } from '../mat/mat-meta.js';
/**
 * @hidden
 * Add a 1-prong to the MAT.
 * @param cpTrees
 * @param pos
 */
declare function add1Prong(meta: MatMeta, radius: number, center: number[], pos: PointOnShape): void;
export { add1Prong };
