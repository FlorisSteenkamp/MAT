import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from '../../loop.js';
import { CpNode } from '../../cp-node.js';
import { IPointOnShape } from '../../point-on-shape.js';
/**
 * @hidden
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornerss
 */
declare function createInitialCpGraph(loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>, sharpCornerss: IPointOnShape[][]): CpNode;
export { createInitialCpGraph };
