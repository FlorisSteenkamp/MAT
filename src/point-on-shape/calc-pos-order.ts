import type { Curve } from "flo-boolean";
import { dot, fromTo, rotateNeg90Degrees, toUnitVector } from "flo-vector2d";
import { isPosCorner } from './is-pos-corner.js';
import { getPosCorner$ } from './get-pos-corner.js';


/**
 * Calculates the order (to distinguish between points lying on top of each 
 * other) of the contact point if it is a dull corner.
 * 
 * @param circle
 * @param pos
 * 
 * @internal
 */
function calcPosOrder(
        circleCenter: number[], 
        pos: { t: number, curve: Curve, p: number[] }): number {

    if (!isPosCorner(pos)) { return 0; }

    const corner = getPosCorner$(pos);

    if (!corner.isDull) { return 0; }

    const n = rotateNeg90Degrees(corner.tangents[0]);
    const v = toUnitVector( fromTo(pos.p, circleCenter) );

    return -dot(n, v);
}


export { calcPosOrder }
