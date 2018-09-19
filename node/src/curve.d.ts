import { Loop } from './loop';
declare class Curve {
    readonly loop: Loop;
    readonly ps: number[][];
    prev: Curve;
    next: Curve;
    readonly idx: number;
    /**
     * Representation of a linked loop vertex (i.e. a bezier) within a linked loop.
     * @param loop The linked loop this node belongs to.
     * @param ps The actual item stored at a node.
     * @param prev The previous item.
     * @param next The next item.
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
