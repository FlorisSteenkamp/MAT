import { Loop } from '../loop.js';
/**
 * @hidden
 * Returns the max extreme point coordinate value for the given shape. This is
 * used for floating point tolerance calculations.
 * @param loops
 */
declare function getExtreme(loops: Loop[]): number;
export { getExtreme };
