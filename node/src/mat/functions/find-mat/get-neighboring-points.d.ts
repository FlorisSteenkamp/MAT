import { CpNode } from '../../../linked-list/cp-node';
import { PointOnShape } from '../../classes/point-on-shape';
import { CpGraph } from '../../../linked-list/cp-graph';
/**
 * Returns the boundary piece that starts at the immediate previous point on
 * the shape and ends at the immediate next point.
 */
declare function getNeighbouringPoints(cpGraph: CpGraph, pos: PointOnShape, order: number, order2: number): CpNode[];
export { getNeighbouringPoints };
