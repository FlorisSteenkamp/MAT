import { evalDeCasteljau, evalDeCasteljauDd } from "flo-bezier3"
import { Curve } from "../curve.js"
import { PointOnShape } from "./point-on-shape.js"


function createPos(
        curve: Curve,
        t: number): PointOnShape {

    return {
        // curve, t, p: evalDeCasteljau(curve.ps, t) //TODO2
        curve, t, p: evalDeCasteljauDd(curve.ps, [0,t]).map(c => c[1])
    }
}


export { createPos }
