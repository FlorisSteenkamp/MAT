import { Curve } from './curve';
/**
 * Represents a two-way linked loop of [[Curve]]s - mostly used internally to
 * conveniently represent shape boundaries.
 */
declare class Loop {
    beziers: number[][][];
    /**
     * The curves that represent the shape boundary as an array.
     */
    readonly curves: Curve[];
    /**
     * A handle on the linked loop.
     */
    readonly head: Curve;
    /**
     * @param beziers - A pre-ordered array of bezier curves to add initially.
     */
    constructor(beziers?: number[][][]);
    /**
     * Returns the loop as an array of beziers.
     */
    toBeziers(): number[][][];
    /**
     * Creates and returns a [[Loop]] from the given array of cubic beziers.
     * @param beziers An array of cubic beziers.
     */
    static fromCubicBeziers(beziers?: number[][][]): Loop;
    /**
     * Creates and returns a [[Loop]] from the given array of beziers.
     * @param beziers An array of bezier curves (linear, quadratic or cubic).
     */
    static fromBeziers(items?: number[][][]): Loop;
    /**
     * Perturbs the loop. Not used.
     * @param loop
     * @param x
     * @private
     */
    static perturb(loop: Loop, x: number): Loop;
}
export { Loop };
