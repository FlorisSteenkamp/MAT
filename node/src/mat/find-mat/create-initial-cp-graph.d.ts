import { Loop } from '../../loop';
import { CpNode } from '../../cp-node';
import { PointOnShape } from '../../point-on-shape';
import LlRbTree from 'flo-ll-rb-tree';
/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornerss
 */
declare function createInitialCpGraph(loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>, sharpCornerss: PointOnShape[][]): CpNode;
export { createInitialCpGraph };
