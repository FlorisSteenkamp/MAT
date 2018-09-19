import { CpNode } from '../../../linked-list/cp-node';
import { CpGraph } from '../../../linked-list/cp-graph';
import { Loop } from '../../../linked-list/loop';
import { Circle } from '../../classes/circle';
import { PointOnShape } from '../../classes/point-on-shape';
/**
 * Adds a 3-prong MAT circle according to the 3 given (previously calculated)
 * points on the shape.
 *
 * @param shape
 * @param circle
 * @param ps
 * @param deltas
 */
declare function add3Prong(cpGraphs: Map<Loop, CpGraph>, orders: number[], threeProng: {
    circle: Circle;
    ps: PointOnShape[];
    δ3s: CpNode[][];
}): Circle;
export { add3Prong };
