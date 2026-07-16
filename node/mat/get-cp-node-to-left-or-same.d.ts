import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { CpNode } from '../cp-node/cp-node.js';
import { LlRbTree } from 'flo-ll-rb-tree';
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
declare function getCpNodeToLeftOrSame(cpTree: LlRbTree<CpNode>, pos: PrePointOnShape, order: number, order2: number): CpNode | undefined;
export { getCpNodeToLeftOrSame };
