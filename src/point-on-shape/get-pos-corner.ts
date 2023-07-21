import { getCornerAtEnd } from "../curve.js";
import { Corner } from "../mat/corner.js";
import { PointOnShape } from "./point-on-shape.js";


/**
 * @internal
 */
function getPosCorner(pos: PointOnShape): Corner {
    return getCornerAtEnd(
        pos.t === 1 ? pos.curve : pos.curve.prev
    );
}


export { getPosCorner }
