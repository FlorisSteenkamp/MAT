import { PointOnShape } from "./point-on-shape.js";
/**
 * Compares two [[PointOnShape]]s according to their cyclic ordering imposed
 * by their relative positions on the shape boundary.
 * @param a The first [[PointOnShape]].
 * @param b The second [[PointOnShape]].
 * @internal
 */
declare function comparePoss(a: PointOnShape, b: PointOnShape): number;
export { comparePoss };
