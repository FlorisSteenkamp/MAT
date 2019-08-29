import { Loop } from '../../../loop';
import { Curve } from '../../../curve';
import { X } from '../../../x/x';
/**
 * Find and return all intersections on all given loops.
 * @param loops
 */
declare function getIntersections(loops: Loop[]): Map<Curve, X[]>;
export { getIntersections };
