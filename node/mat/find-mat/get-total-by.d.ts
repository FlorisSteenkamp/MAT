import { Curve } from '../../curve';
import { Loop } from '../../loop';
/**
 * Helper function.
 * @private
 * @param f
 */
declare function getTotalBy(f: (curve: Curve) => number): (loop: Loop) => number;
export { getTotalBy };
