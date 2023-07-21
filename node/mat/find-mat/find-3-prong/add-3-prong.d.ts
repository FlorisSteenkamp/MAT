import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from '../../../cp-node/cp-node.js';
import { Loop } from 'flo-boolean';
import { Circle } from '../../../circle.js';
import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
/**
 * @internal
 *
 * Adds a 3-prong MAT circle according to the 3 given (previously calculated)
 * points on the shape.
 *
 * Returns 3 CpNodes if successful, else return one CpNode that is an offending
 * too close existing CpNode.
 *
 * @param cpTrees
 * @param orders
 * @param threeProng
 */
declare function add3Prong(cpTrees: Map<Loop, LlRbTree<CpNode>>, orders: number[], threeProng: {
    circle: Circle;
    ps: PointOnShape[];
    δ3s: CpNode[][];
}): CpNode[];
export { add3Prong };
