import { getPosCorner$ } from "./get-pos-corner.js";
import { isPosCorner } from "./is-pos-corner.js";
import { PointOnShape } from "./point-on-shape.js";


/**
 * @internal
 */
function isPosSharpCorner(
        pos: PointOnShape) {

    if (!isPosCorner(pos)) { return false; }

    return getPosCorner$(pos).isSharp;
}


export { isPosSharpCorner }
