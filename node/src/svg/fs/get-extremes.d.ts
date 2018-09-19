import { Loop } from '../../loop';
import { PointOnShape } from '../../point-on-shape';
/**
 * Get topmost point, bezierNode and t-value of the given loop.
 */
declare let getExtreme: (a: Loop) => PointOnShape;
export { getExtreme };
