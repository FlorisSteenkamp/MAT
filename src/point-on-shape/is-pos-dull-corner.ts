import { memoize } from "flo-memoize";
import { getPosCorner } from "./get-pos-corner.js";
import { isPosCorner } from "./is-pos-corner.js";
import { PointOnShape } from "./point-on-shape.js";

/**
 * @internal
 */
// const isPosDullCorner = memoize(
    function isPosDullCorner(pos: PointOnShape) {
        if (!isPosCorner(pos)) { return false; }

        return getPosCorner(pos).isDull;
    }
// );


export { isPosDullCorner }
