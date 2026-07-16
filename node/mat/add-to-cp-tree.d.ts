import type { Circle } from '../geometry/circle.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { CpNode } from '../cp-node/cp-node.js';
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * @param circle
 * @param orders
 * @param cpTrees
 * @param poss
 * @param neighbors
 *
 * @internal
 */
declare function addToCpTree(insertIfOrderIsWrong: boolean, isHoleClosing: boolean, circle: Circle, orders: number[], meta: MatMeta, poss: PrePointOnShape[], neighbors?: CpNode[]): {
    anyFailed: boolean;
    cpNodes: (CpNode | undefined)[];
};
export { addToCpTree };
