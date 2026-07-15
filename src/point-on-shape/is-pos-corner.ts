import { PointOnShape } from "./point-on-shape.js";


/**
 * @internal
 */
function isPosCorner(pos: { t: number }) {
    return (pos.t === 0 || pos.t === 1);
}


export { isPosCorner }
