import { Curve } from "flo-boolean";
type FootAndEndpointInfo = {
    curve: Curve;
    p: number[];
    t: number;
    d: number;
    box: number[][];
    dSquaredI: number[];
};
export { FootAndEndpointInfo };
