import { Loop } from '../../../linked-list/loop';
import { Circle } from '../circle';
import { PointOnShape } from '../point-on-shape';
import { Vertex } from './vertex';
import { CpGraph } from '../../../linked-list/cp-graph';
declare function create2(circle: Circle, orders: number[], cpGraphs: Map<Loop, CpGraph>, poss?: PointOnShape[]): Vertex;
export { create2 };
