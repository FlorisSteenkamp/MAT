import type { Curve } from "flo-boolean";
import type { PointOnShape } from "./point-on-shape.js";
import { evalDeCasteljauDd } from "flo-bezier3";
import { Circle } from "../geometry/circle.js";


// function createPos(
//         curve: Curve,
//         t: number,
//         circle: Circle,
//         order: number,
//         order2: number,
//         isSource?: boolean): PointOnShape {

//     return {
//         curve,
//         t,
//         isSource: isSource === undefined ? false : isSource,
//         p: evalDeCasteljauDd(curve.ps, [0,t]).map(c => c[1]),
//         order, order2,
//     }
// }

// TODO - change file name

function toP(
        ps: number[][],
        t: number): number[] {

    return evalDeCasteljauDd(ps, [0,t]).map(c => c[1]);
}


export { toP }
