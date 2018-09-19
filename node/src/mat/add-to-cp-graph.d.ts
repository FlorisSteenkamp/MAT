import LlRbTree from 'flo-ll-rb-tree';
import { Loop } from '../loop';
import { Circle } from '../circle';
import { PointOnShape } from '../point-on-shape';
import { CpNode } from '../cp-node';
declare function addToCpGraph(circle: Circle, orders: number[], cpTrees: Map<Loop, LlRbTree<CpNode>>, poss?: PointOnShape[], neighbors?: CpNode[][]): void;
export { addToCpGraph };
