import { memoize } from 'flo-memoize';
import { PointOnShape } from "./point-on-shape.js";
import { isPosCorner } from './is-pos-corner.js';
import { getPosCorner } from './get-pos-corner.js';


/**
 * @internal
 */
const isPosQuiteDullCorner = memoize((pos: PointOnShape) => {
    if (!isPosCorner(pos)) { return false; }

    return getPosCorner(pos).isQuiteDull;
});


export { isPosQuiteDullCorner }
