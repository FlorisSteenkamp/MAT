import { Loop } from './loop';
declare class Curve {
    readonly loop: Loop;
    readonly ps: number[][];
    prev: Curve;
    next: Curve;
    readonly idx: number;
    /**
     * Representation of a curve in a linked loop (of bezier curves).
     * @param loop The linked loop this node belongs to.
     * @param ps The bezier points.
     * @param prev The previous curve.
     * @param next The next curve.
     * @param idx The curve's ordered index in the loop.
     */
    constructor(loop: Loop, ps: number[][], prev: Curve, next: Curve, idx: number);
    static getCornerAtEnd(curve: Curve): {
        tans: number[][];
        crossTangents: number;
        isSharp: boolean;
        isDull: boolean;
        isQuiteSharp: boolean;
        isQuiteDull: boolean;
    };
}
export { Curve };
