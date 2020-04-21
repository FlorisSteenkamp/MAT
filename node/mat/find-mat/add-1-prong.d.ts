import LlRbTree from 'flo-ll-rb-tree';
import { Loop } from '../../loop';
import { IPointOnShape } from '../../point-on-shape';
import { CpNode } from '../../cp-node';
/**
 * @hidden
 * Add a 1-prong to the MAT.
 * @param cpGraphs
 * @param pos
 */
declare function add1Prong(maxOsculatingCircleRadius: number, cpGraphs: Map<Loop, LlRbTree<CpNode>>, pos: IPointOnShape): void;
export { add1Prong };
