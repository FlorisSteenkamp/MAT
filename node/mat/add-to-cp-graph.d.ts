import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { Circle } from '../geometry/circle.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { CpNode } from '../cp-node/cp-node.js';
/**
 * @internal
 *
 * @param circle
 * @param orders
 * @param cpTrees
 * @param poss
 * @param neighbors
 * @internal
 */
declare function addToCpGraph(circle: Circle, orders: number[], cpTrees: Map<Loop, LlRbTree<CpNode>>, poss: PointOnShape[], neighbors?: CpNode[][]): CpNode[];
export { addToCpGraph };
