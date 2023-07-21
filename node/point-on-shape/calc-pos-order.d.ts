import { Circle } from "../circle.js";
import { PointOnShape } from "./point-on-shape.js";
/**
 * @internal
 * Calculates the order (to distinguish between points lying on top of each
 * other) of the contact point if it is a dull corner.
 * @param pos
 */
declare function calcPosOrder(circle: Circle, pos: PointOnShape): number;
export { calcPosOrder };
