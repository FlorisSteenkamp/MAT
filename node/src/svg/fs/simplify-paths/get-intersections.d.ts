import { Loop } from '../../../loop';
import { Curve } from '../../../curve';
import { IXInfo } from './i-x-info';
/**
 * Find and return all intersections on all given loops.
 * @param loops
 */
declare function getIntersections(loops: Loop[]): Map<Curve, IXInfo[]>;
export { getIntersections };
