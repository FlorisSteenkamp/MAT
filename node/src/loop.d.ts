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
     * @param beziers A pre-ordered array of bezier curves to add initially.
     */
    constructor(beziers?: number[][][]);
}
export { Loop };
