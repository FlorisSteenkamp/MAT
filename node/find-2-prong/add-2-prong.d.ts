import type { CpNode } from '../cp-node/cp-node.js';
import type { Circle } from '../geometry/circle.js';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import type { MatMeta } from '../mat/mat-meta.js';
/**
 * Adds a 2-prong contact circle to the shape.
 *
 * @param meta
 * @param circle Circle containing the 2 contact points
 * @param pposSource The source point on shape
 * @param pposAntipode The found antipodal point on shape
 * @param isHoleClosing True if this is a hole-closing 2-prong, false otherwise
 *
 * @internal
 */
declare function add2Prong(meta: MatMeta, circle: Circle, pposSource: PrePointOnShape, pposAntipode: PrePointOnShape, isHoleClosing: boolean): CpNode | undefined;
export { add2Prong };
