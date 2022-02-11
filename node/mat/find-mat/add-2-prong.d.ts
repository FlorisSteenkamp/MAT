import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from '../../loop.js';
import { CpNode } from '../../cp-node.js';
import { Circle } from '../../circle.js';
import { IPointOnShape } from '../../point-on-shape.js';
/**
 * @hidden
 * Adds a 2-prong contact circle to the shape.
 * @param cpGraphs
 * @param circle Circle containing the 2 contact points
 * @param posSource The source point on shape
 * @param posAntipode The found antipodal point on shape
 * @param holeClosing True if this is a hole-closing 2-prong, false otherwise
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function add2Prong(cpGraphs: Map<Loop, LlRbTree<CpNode>>, circle: Circle, posSource: IPointOnShape, posAntipodes: {
    pos: IPointOnShape;
    d: number;
}[], holeClosing: boolean, extreme: number): CpNode;
export { add2Prong };
