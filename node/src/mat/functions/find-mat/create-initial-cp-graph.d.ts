import { Loop } from '../../../linked-list/loop';
import { CpGraph } from '../../../linked-list/cp-graph';
import { PointOnShape } from '../../classes/point-on-shape';
/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornerss
 */
declare function createInitialCpGraph(loops: Loop[], sharpCornerss: PointOnShape[][]): Map<Loop, CpGraph>;
export { createInitialCpGraph };
