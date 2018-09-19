import { CpGraph } from '../../../linked-list/cp-graph';
import { Loop } from '../../../linked-list/loop';
import { PointOnShape } from '../../classes/point-on-shape';
/**
 * Add a 1-prong to the MAT.
 * @param shape
 * @param pos
 */
declare function add1Prong(cpGraphs: Map<Loop, CpGraph>, pos: PointOnShape): void;
export { add1Prong };
