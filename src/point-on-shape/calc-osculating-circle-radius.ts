import { curvature } from "flo-bezier3";
import { memoize } from "flo-memoize";
import { PointOnShape } from "./point-on-shape.js";


/**
 * Calculates and returns the osculating circle radius of the bezier at a 
 * specific t. If it is found to have negative or nearly zero radius
 * it is clipped to have positive radius so it can point into the shape.
 * @param ps
 * @param t
 * @internal
 */
const calcOsculatingCircleRadius = memoize((pos: PointOnShape) => {
    const ps = pos.curve.ps;
    const t  = pos.t;

    // TODO2 - can make double-double?
    // TODO2 - can use 1/radius instead?
    const c = -curvature(ps, t);

    // c > 0 => bending inwards

    return 1/c;
});


export { calcOsculatingCircleRadius }
