import { RootInterval } from "flo-poly";
import { Curve } from "../curve/curve";


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
