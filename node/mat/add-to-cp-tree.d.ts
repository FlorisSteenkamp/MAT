import type { Circle } from '../geometry/circle.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { CpNode } from '../cp-node/cp-node.js';
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * Insert the given `poss` into the `cpTree` (within `meta`) and returns the
 * newly inserted `CpNode`s.
 *
 * @param circle
 * @param orders
 * @param cpTrees
 * @param poss
 * @param neighbors
 *
 * @internal
 */
declare function addToCpTree(insertIfOrderIsWrong: boolean, isHoleClosing: boolean, circle: Circle, orders: number[], meta: MatMeta, poss: PrePointOnShape[], neighbors?: [CpNode, CpNode][]): {
    anyFailed: boolean;
    cpNodes: (CpNode | undefined)[];
};
export { addToCpTree };
