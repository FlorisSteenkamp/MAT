import type { Curve } from "flo-boolean";


interface AntipodalPoint {
    readonly curve: Curve;
    readonly s: number;
    readonly d: number;
    readonly x: number[];
}


export type { AntipodalPoint }
