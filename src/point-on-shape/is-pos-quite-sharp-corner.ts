import type { PointOnShape } from "./point-on-shape.js";
import { isPosCorner } from './is-pos-corner.js';
import { getPosCorner$ } from './get-pos-corner.js';


/**
 * @internal
 */
function isPosQuiteSharpCorner(
        pos: PointOnShape) {

    if (!isPosCorner(pos)) { return false; }

    return getPosCorner$(pos).isQuiteSharp;
}


export { isPosQuiteSharpCorner }
