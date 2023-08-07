import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
/**
 * @hidden
 * Add a 1-prong to the MAT.
 * @param cpGraphs
 * @param pos
 */
declare function add1Prong(radius: number, center: number[], cpGraphs: Map<Loop, LlRbTree<CpNode>>, pos: PointOnShape): void;
export { add1Prong };
