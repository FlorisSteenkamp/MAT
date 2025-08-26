import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Circle } from '../geometry/circle.js';
import { MatMeta } from './mat-meta.js';
/**
 * @internal
 * If another `CpNode` is close by (to the given implied (via `pos`, `order` and
 * `order2`) then return it, else return `undefined`.
 *
 * @param meta
 * @param pos
 * @param circle
 * @param order
 * @param order2
 */
declare function getCloseByCpIfExist(meta: MatMeta, pos: PointOnShape, circle: Circle, order: number, order2: number, forProngCount?: number): CpNode | undefined;
export { getCloseByCpIfExist };
