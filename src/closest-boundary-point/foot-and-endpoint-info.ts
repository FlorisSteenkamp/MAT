// import { RootInterval } from "flo-poly";
import { Curve } from "../curve/curve.js";


type FootAndEndpointInfo = {
    curve: Curve;
    p: number[];
    t: number;
    d: number;
    box: number[][];
    // ri: RootInterval;
    dSquaredI: number[];
}


export { FootAndEndpointInfo }
