import { Curve } from '../curve';
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
     * @param children - Child loops connected via hole closers
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
     * Perturbs the loop. Not used.
     * @param loop
     * @param x
     * @hidden
     */
    static perturb(loop: Loop, x: number): Loop;
    /**
     * reduceSignificands of the loop. Not used.
     * @param loop
     * @param x
     * @hidden
     */
    static toGrid(loop: Loop, max: number, significantFigures: number): Loop;
}
export { Loop };
