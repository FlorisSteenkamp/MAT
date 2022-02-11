import { Curve } from '../../curve.js';
import { Loop } from '../../loop.js';
/**
 * @hidden
 * Helper function.
 * @hidden
 * @param f
 */
declare function getTotalBy(f: (curve: Curve) => number): (loop: Loop) => number;
export { getTotalBy };
