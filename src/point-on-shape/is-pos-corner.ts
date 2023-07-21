import { PointOnShape } from "./point-on-shape.js";


/**
 * @internal
 */
function isPosCorner(pos: PointOnShape) {
    return (pos.t === 0 || pos.t === 1);
}


export { isPosCorner }
