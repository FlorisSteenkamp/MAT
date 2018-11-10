import LlRbTree from 'flo-ll-rb-tree';
import { CpNode } from '../../cp-node';
import { Loop } from '../../loop';
import { Circle } from '../../circle';
import { PointOnShape } from '../../point-on-shape';
/**
 * Adds a 3-prong MAT circle according to the 3 given (previously calculated)
 * points on the shape.
 * @param cpTrees
 * @param orders
 * @param threeProng
 */
declare function add3Prong(cpTrees: Map<Loop, LlRbTree<CpNode>>, orders: number[], threeProng: {
    circle: Circle;
    ps: PointOnShape[];
    δ3s: CpNode[][];
}): Circle;
export { add3Prong };
