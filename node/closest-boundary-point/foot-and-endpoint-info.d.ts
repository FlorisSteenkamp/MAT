import { Curve } from "../curve/curve";
type FootAndEndpointInfo = {
    curve: Curve;
    p: number[];
    t: number;
    d: number;
    box: number[][];
    dSquaredI: number[];
};
export { FootAndEndpointInfo };
