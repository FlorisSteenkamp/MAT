import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * @internal
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornerss
 */
declare function createInitialCpTree(loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>, sharpCornerss: PointOnShape[][]): CpNode | undefined;
export { createInitialCpTree };
