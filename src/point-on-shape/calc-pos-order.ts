import { dot, fromTo, rotateNeg90Degrees, toUnitVector } from "flo-vector2d";
import { Circle } from "../circle.js";
import { PointOnShape } from "./point-on-shape.js";
import { isPosCorner } from './is-pos-corner.js';
import { isPosDullCorner } from "./is-pos-dull-corner.js";
import { getPosCorner } from './get-pos-corner.js';



/**
 * @internal
 * 
 * Calculates the order (to distinguish between points lying on top of each 
 * other) of the contact point if it is a dull corner.
 * 
 * @param circle
 * @param pos
 */
function calcPosOrder(
        circle: Circle, 
        pos: PointOnShape): number {

    if (!isPosCorner(pos)) { return 0; }
    if (!isPosDullCorner(pos)) { return 0; }

    const corner = getPosCorner(pos);

    // TODO2 - Can be made more accurate with double-double?
    const n = rotateNeg90Degrees(corner.tangents[0]);
    const v = toUnitVector( fromTo(pos.p, circle.center) );

    // TODO2 - make more accurate??
    return -dot(n, v);
}


export { calcPosOrder }
