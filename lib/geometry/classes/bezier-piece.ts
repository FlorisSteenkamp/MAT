
import ListNode from '../../linked-list/list-node';
import PathCurve from './path-curve'

class BezierPiece {

    bezierNode: ListNode<PathCurve>;
    tRange: number[];

    /**
     * @param bezierNode
     * @param tRange
     */
	constructor(bezierNode: ListNode<PathCurve>, tRange: number[]) {
    	this.bezierNode = bezierNode;
        this.tRange     = tRange;
    }
}


export default BezierPiece;
