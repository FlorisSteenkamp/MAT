import type { CpNode } from "../cp-node.js";
import { RbTree } from "flo-ll-rb-tree";
import { PointOnShape } from "../../point-on-shape/point-on-shape.js";
/**
 *
 * @param cpTree
 * @param pos
 * @param succ
 * @param alreadyInserted set to `true` if the given `pos` has already been
 * inserted, `false` otherwise.
 */
declare function isOrderCorrect(cpTree: RbTree<CpNode>, pred: CpNode, pos: PointOnShape, succ: CpNode, alreadyInserted: boolean): boolean;
export { isOrderCorrect };
