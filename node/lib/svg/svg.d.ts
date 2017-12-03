import PathCurve from '../geometry/classes/path-curve';
import LinkedLoop from '../linked-list/linked-loop';
import ListNode from '../linked-list/list-node';
declare const Svg: {
    getBeziersFromSvgElem: (elem: SVGElement) => PathCurve[][];
    getPathStrFromBezierLoop: (bezierLoop: LinkedLoop<ListNode<number[][]>>) => string;
    getPathStrFromBeziers: (beziers: number[][][], decimalPlaces?: number) => string;
};
export default Svg;
