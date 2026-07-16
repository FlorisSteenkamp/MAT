import type { Corner } from "./corner.js";
/**
 * @internal
 * Returns a new corner with properties.
 *
 * @param psI The incoming bezier that ends in the corner
 * @param psO The outgoing bezier that starts at the corner
 */
declare function getCorner(psI: number[][], psO: number[][]): Corner;
export { getCorner };
