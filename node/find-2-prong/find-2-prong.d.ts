import { Circle } from '../geometry/circle.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Adds a 2-prong to the MAT. The first point on the shape boundary is given and
 * the second one is found by the algorithm.
 *
 * A 2-prong is defined as a MAT circle that touches the shape at exactly 2
 * points.
 *
 * Before any 2-prongs are added the entire shape is our δΩ.
 *
 * As per the paper by Choi, Choi, Moon and Wee:
 *   "The starting point of this algorithm is a choice of a circle Br(x)
 *    centered at an interior point x which contains two boundary portions c and
 *    d of dΩ as in Fig. 19."
 * In fact, we (and they) start by fixing one point on the boundary beforehand.
 * @param loops A shape represented by path loops
 * @param maxCoordinate The extreme coordinate value of the shape
 * @param squaredDiagonalLength The squared diagonal length of the shape
 * bounding box.
 * @param y The source point of the 2-prong to be found
 * @param isHoleClosing True if this is a hole-closing two-prong, false otherwise
 * @param loopIdx The loop array index
 */
declare function find2Prong(meta: MatMeta, isHoleClosing: boolean, for1Prong: boolean, angle: number, y: PointOnShape): {
    circle: Circle;
    zs: PointOnShape[];
} | undefined;
export { find2Prong };
