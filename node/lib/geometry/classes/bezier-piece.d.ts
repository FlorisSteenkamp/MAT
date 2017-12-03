import ListNode from '../../linked-list/list-node';
import PathCurve from './path-curve';
declare class BezierPiece {
    bezierNode: ListNode<PathCurve>;
    tRange: number[];
    /**
     * @param bezierNode
     * @param tRange
     */
    constructor(bezierNode: ListNode<PathCurve>, tRange: number[]);
}
export default BezierPiece;
