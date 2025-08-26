import { CpNode } from '../cp-node/cp-node.js';
import { Circle } from '../geometry/circle.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { MatMeta } from '../mat/mat-meta.js';
/**
 * @internal
 * Adds a 2-prong contact circle to the shape.
 *
 * @param cpTrees
 * @param circle Circle containing the 2 contact points
 * @param posSource The source point on shape
 * @param posAntipode The found antipodal point on shape
 * @param isHoleClosing True if this is a hole-closing 2-prong, false otherwise
 * @param maxCoordinate The maximum coordinate value used to calculate floating point
 * tolerances.
 */
declare function add2Prong(meta: MatMeta, circle: Circle, poss: PointOnShape[], isHoleClosing: boolean): CpNode | undefined;
export { add2Prong };
