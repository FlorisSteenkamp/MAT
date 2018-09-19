import { Curve } from './curve';
declare class BezierPiece {
    curve: Curve;
    ts: number[];
    /**
     * @param curve
     * @param ts The start and end t parameter of the original bezier curve
     */
    constructor(curve: Curve, ts: number[]);
}
export { BezierPiece };
