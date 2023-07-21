import { PointOnShape } from "./point-on-shape.js";


/**
 * Compares two [[PointOnShape]]s according to their cyclic ordering imposed
 * by their relative positions on the shape boundary. 
 * @param a The first [[PointOnShape]].
 * @param b The second [[PointOnShape]].
 * @internal
 */
function comparePoss(
        a: PointOnShape,
        b: PointOnShape): number {

    let res;

    res = a.curve.idx - b.curve.idx;
    if (res !== 0) { return res; }

    res = a.t - b.t;

    return res;
}


export { comparePoss }
