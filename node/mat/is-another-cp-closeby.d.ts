import LlRbTree from "flo-ll-rb-tree";
import { Loop } from "../loop/loop";
import { CpNode } from "../cp-node/cp-node";
import { PointOnShape } from "../point-on-shape";
import { Circle } from "../circle";
/**
 * Returns true if another CpNode is close to the given implied (via pos, order
 * and order2) CpNode.
 * @param cpTrees
 * @param pos
 * @param circle
 * @param order
 * @param order2
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 * @param color Used for debugging only
 */
declare function isAnotherCpCloseby(cpTrees: Map<Loop, LlRbTree<CpNode>>, pos: PointOnShape, circle: Circle, order: number, order2: number, extreme: number, color: string): boolean;
export { isAnotherCpCloseby };
