import type { PointOnShape } from "./point-on-shape.js";
import { getPosCorner$ } from "./get-pos-corner.js";
import { isPosCorner } from "./is-pos-corner.js";


/**
 * @internal
 */
function isPosDullCorner(
        pos: PointOnShape) {

    if (!isPosCorner(pos)) { return false; }

    return getPosCorner$(pos).isDull;
}


export { isPosDullCorner }
