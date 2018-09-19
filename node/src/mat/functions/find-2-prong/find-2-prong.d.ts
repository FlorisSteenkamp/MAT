import { Loop } from '../../../linked-list/loop';
import { Circle } from '../../classes/circle';
import { PointOnShape } from '../../classes/point-on-shape';
import { CpGraph } from '../../../linked-list/cp-graph';
/**
 * Adds a 2-prong to the MAT. The first point on the shape boundary is given and
 * the second one is found by the algorithm.
 *
 * A 2-prong is a MAT circle that touches the shape at exactly 2 points.
 *
 * Before any 2-prongs are added the entire shape is our δΩ (1-prongs do not
 * reduce the boundary).
 *
 * As per the paper by Choi, Choi, Moon and Wee:
 *   "The starting point of this algorithm is a choice of a circle
 *    Br(x) centered at an interior point x which contains two boundary
 *    portions c and d of d-Omega as in Fig. 19."
 * In fact, we (and they) start by fixing one point on the boundary beforehand.
 * @param shape
 * @param y - The first point of the 2-prong
 * @param holeClosing True if this is a hole-closing two-prong, false otherwise
 * @param k The loop identifying index for y
 */
declare function find2Prong(loops: Loop[], cpGraphs: CpGraph[], y: PointOnShape, holeClosing: boolean, k: number): {
    circle: Circle;
    z: PointOnShape;
};
export { find2Prong };
