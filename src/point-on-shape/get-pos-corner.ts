import type { Corner } from "../corner/corner.js";
import type { PointOnShape } from "./point-on-shape.js";
import { getCorner } from "../corner/get-corner.js";


/**
 * @internal
 */
function getPosCorner(pos: PointOnShape): Corner {
    return getCorner(
        pos.t === 1 ? pos.curve.ps : pos.curve.prev.ps,
        pos.t === 1 ? pos.curve.next.ps : pos.curve.ps,
    );
}


export { getPosCorner }
