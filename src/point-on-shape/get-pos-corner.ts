import { memoize } from "flo-memoize";
import { Corner } from "../corner/corner.js";
import { getCorner } from "../corner/get-corner.js";
import { PointOnShape } from "./point-on-shape.js";


/**
 * @internal
 */
// const getPosCorner$ = memoize(
    function getPosCorner(pos: PointOnShape): Corner {
        return getCorner(
            pos.t === 1 ? pos.curve.ps : pos.curve.prev.ps,
            pos.t === 1 ? pos.curve.next.ps : pos.curve.ps,
        );
    }
// );


export { getPosCorner }
