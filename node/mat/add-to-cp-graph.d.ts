import LlRbTree from 'flo-ll-rb-tree';
import { Loop } from '../loop';
import { Circle } from '../circle';
import { PointOnShape } from '../point-on-shape';
import { CpNode } from '../cp-node';
/**
 * @hidden
 * @param circle
 * @param orders
 * @param cpTrees
 * @param poss
 * @param neighbors
 * @hidden
 */
declare function addToCpGraph(circle: Circle, orders: number[], cpTrees: Map<Loop, LlRbTree<CpNode>>, poss: PointOnShape[], neighbors?: CpNode[][]): void;
export { addToCpGraph };
