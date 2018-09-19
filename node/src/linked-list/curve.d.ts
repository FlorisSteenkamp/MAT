import { Loop } from './loop';
/**
 * Representation of a linked loop vertex (i.e. a bezier) within a linked loop.
 */
declare class Curve {
    readonly loop: Loop;
    readonly ps: number[][];
    prev: Curve;
    next: Curve;
    readonly idx: number;
    /**
     * @param loop The linked loop this node belongs to.
     * @param ps The actual item stored at a node.
     * @param prev The previous item.
     * @param next The next item.
     * @param idx The curve's ordered index in the loop.
     */
    constructor(loop: Loop, ps: number[][], prev: Curve, next: Curve, idx: number);
    readonly corner: {
        tans: number[][];
        crossTangents: number;
        isDull: boolean;
        isQuiteSharp: boolean;
        isQuiteDull: boolean;
    };
    /**
     * Advances the node by the given number of steps. This is slow ( O(n) );
     * use mostly for debugging.
     * @param node - Node to start counting from
     * @param n - Number of steps to advance
     */
    static advanceNSteps(node: Curve, n: number): Curve;
}
export { Curve };
