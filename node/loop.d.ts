import { Curve } from './curve';
/**
 * Represents a two-way linked loop of [[ICurve]]s - mostly used internally to
 * conveniently represent shape boundaries.
 */
interface Loop {
    /** The curves that represent the shape boundary as an array. */
    curves: Curve[];
    /** A pre-ordered array of bezier curves to add initially.*/
    beziers: number[][][];
}
/**
 * @param beziers A pre-ordered array of bezier curves to add initially.
 */
declare function loopFromBeziers(beziers?: number[][][]): Loop;
export { Loop, loopFromBeziers };
