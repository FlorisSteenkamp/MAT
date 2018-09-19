import { Curve } from '../../linked-list/curve';
declare class BezierPiece {
    bezierNode: Curve;
    tRange: number[];
    /**
     * @param bezierNode
     * @param tRange
     */
    constructor(bezierNode: Curve, tRange: number[]);
}
export { BezierPiece };
