import type { Curve } from "flo-boolean";


interface FootAndEndpointInfo {
    readonly curve: Curve;
    readonly p: number[];
    readonly t: number;
    readonly d: number;
    readonly box: number[][];
    readonly dSquaredI: number[];
}


export { FootAndEndpointInfo }
