import LlRbTree from 'flo-ll-rb-tree';
import { PointOnShape } from '../point-on-shape';
import { CpNode } from '../../cp-node';
/**
 * @hidden
 * Returns the boundary piece that starts at the immediate previous point on the
 * shape and ends at the immediate next point.
 * @param cpTree
 * @param pos
 * @param order
 * @param order2
 */
declare function getNeighbouringPoints(cpTree: LlRbTree<CpNode>, pos: PointOnShape, order: number, order2: number): CpNode[];
export { getNeighbouringPoints };
