import { Curve } from '../../../linked-list/curve';
import { Loop } from '../../../linked-list/loop';
/**
 * Helper function.
 * @private
 * @param f
 */
declare function getTotalBy(f: (bezierNode: Curve) => number): (bezierLoop: Loop) => number;
export { getTotalBy };
