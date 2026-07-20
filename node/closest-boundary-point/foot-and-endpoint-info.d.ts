import type { Curve } from "flo-boolean";
interface FootAndEndpointInfo {
    readonly curve: Curve;
    readonly t: number;
    readonly dSquaredI: number[];
}
export { FootAndEndpointInfo };
