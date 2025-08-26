import { Curve } from "../curve/curve.js";
type FootAndEndpointInfo = {
    curve: Curve;
    p: number[];
    t: number;
    d: number;
    box: number[][];
    dSquaredI: number[];
};
export { FootAndEndpointInfo };
