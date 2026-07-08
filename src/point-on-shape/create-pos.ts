import type { Curve } from "flo-boolean";
import type { PointOnShape } from "./point-on-shape.js";
import { evalDeCasteljauDd } from "flo-bezier3";


function createPos(
        curve: Curve,
        t: number,
        isSource?: boolean): PointOnShape {

    return {
        curve,
        t,
        p: evalDeCasteljauDd(curve.ps, [0,t]).map(c => c[1]),
        isSource: isSource === undefined ? false : isSource
    }
}


export { createPos }
