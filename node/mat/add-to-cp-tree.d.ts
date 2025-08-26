import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { Circle } from '../geometry/circle.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { CpNode } from '../cp-node/cp-node.js';
/**
 * @param circle
 * @param orders
 * @param cpTrees
 * @param poss
 * @param neighbors
 *
 * @internal
 */
declare function addToCpTree(insertIfOrderIsWrong: boolean, isHoleClosing: boolean, circle: Circle, orders: number[], cpTrees: Map<Loop, LlRbTree<CpNode>>, poss: PointOnShape[], neighbors?: CpNode[]): {
    anyFailed: boolean;
    cpNodes: (CpNode | undefined)[];
};
export { addToCpTree };
