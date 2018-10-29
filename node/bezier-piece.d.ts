import { Curve } from './curve';
/**
 * Represents a part of a bezier within the shape boundary.
 */
declare class BezierPiece {
    curve: Curve;
    ts: number[];
    /**
     * @param curve A bezier curve within the shape boundary.
     * @param ts The start and end t parameter values of the bezier curve.
     */
    constructor(curve: Curve, ts: number[]);
}
export { BezierPiece };
