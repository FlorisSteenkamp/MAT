import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from '../loop.js';
import { Circle } from '../circle.js';
import { IPointOnShape } from '../point-on-shape.js';
import { CpNode } from '../cp-node.js';
/**
 * @hidden
 * @param circle
 * @param orders
 * @param cpTrees
 * @param poss
 * @param neighbors
 * @hidden
 */
declare function addToCpGraph(circle: Circle, orders: number[], cpTrees: Map<Loop, LlRbTree<CpNode>>, poss: IPointOnShape[], neighbors?: CpNode[][]): void;
export { addToCpGraph };
