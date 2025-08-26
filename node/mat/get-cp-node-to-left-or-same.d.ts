import { LlRbTree } from 'flo-ll-rb-tree';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { CpNode } from '../cp-node/cp-node.js';
/**
 * @internal
 *
 * Returns the predecessor `CpNode` in the `CpTree` or the same one if they fall
 * on top of each other.
 *
 * * returns `undefined` if the tree is still empty
 *
 * @param cpTree
 * @param pos
 * @param order
 * @param order2
 */
declare function getCpNodeToLeftOrSame(cpTree: LlRbTree<CpNode>, pos: PointOnShape, order: number, order2: number): CpNode | undefined;
export { getCpNodeToLeftOrSame };
