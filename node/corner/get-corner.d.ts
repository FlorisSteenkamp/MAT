import { Corner } from "./corner.js";
/**
 * @internal
 * Returns a new corner with properties.
 *
 * PRECONDITION: The beziers has control points with max bit-length of 26 and
 * aligned to a 'grid' to have the same exponent. This is so the vectors between
 * control points can be calculated exactly without resorting to adaptive
 * infinite precision floating point operations.
 *
 * @param psI The incoming bezier that ends in the corner
 * @param psO The outgoing bezier that starts at the corner
 */
declare function getCorner(psI: number[][], psO: number[][]): Corner;
export { getCorner };
