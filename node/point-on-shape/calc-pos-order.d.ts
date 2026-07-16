import type { Curve } from "flo-boolean";
/**
 * Calculates the order (to distinguish between points lying on top of each
 * other) of the contact point if it is a dull corner.
 *
 * @param circle
 * @param pos
 *
 * @internal
 */
declare function calcPosOrder(circleCenter: number[], pos: {
    t: number;
    curve: Curve;
    p: number[];
}): number;
export { calcPosOrder };
