import { Loop } from '../../linked-list/loop';
import { Circle } from '../classes/circle';
import { PointOnShape } from '../classes/point-on-shape';
import { CpGraph } from '../../linked-list/cp-graph';
declare function addToCpGraph(circle: Circle, orders: number[], cpGraphs: Map<Loop, CpGraph>, poss?: PointOnShape[]): void;
export { addToCpGraph };
