import PointOnShape from '../../classes/point-on-shape';
import ListNode from '../../../linked-list/list-node';
import ContactPoint from '../../classes/contact-point';
import Circle from '../../classes/circle';
declare class TwoProngForDebugging {
    pos: PointOnShape;
    δ: ListNode<ContactPoint>[];
    y: number[];
    z: number[];
    x: number[];
    circle: Circle;
    xs: {
        x: number[];
        y: PointOnShape;
        z: PointOnShape;
        t: number;
    }[];
    failed: boolean;
    holeClosing: boolean;
    constructor(pos: PointOnShape, δ: ListNode<ContactPoint>[], y: number[], z: number[], x: number[], circle: Circle, xs: {
        x: number[];
        y: PointOnShape;
        z: PointOnShape;
        t: number;
    }[], failed: boolean, holeClosing: boolean);
}
export default TwoProngForDebugging;
