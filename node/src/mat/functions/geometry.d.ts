import { ListNode } from '../../linked-list/list-node';
import { Arc } from '../classes/arc';
import { ContactPoint } from '../classes/contact-point';
declare const Geometry: {
    lineLineIntersection: (l1: number[][], l2: number[][]) => number[];
    getLineBoundaryIntersectionPoints: (line: number[][], δ: ListNode<ContactPoint>[]) => number[][];
    closestSquaredDistanceToRotatedRect: (ps: number[][], p: number[]) => number;
    getClosestSquareDistanceToRect: (box: number[][], p: number[]) => number;
    degAngleFromSinCos: (sinθ: number, cosθ: number) => number;
    arcFrom3Points: (ps: number[][]) => Arc;
    quadrant: (sinθ: number, cosθ: number) => 1 | 2 | 3 | 4;
    isAngle1LargerOrEqual: (sinθ1: number, cosθ1: number, sinθ2: number, cosθ2: number) => boolean;
    isAngleBetween: (sinθ: number, cosθ: number, sinθ1: number, cosθ1: number, sinθ2: number, cosθ2: number) => boolean;
    lineThroughPointAtRightAngleTo: (p: number[], v: number[]) => number[][];
    getLineBezierIntersectionPoints: (line: number[][], ps: number[][], tRange: number[]) => {
        p: number[];
        t: number;
    }[];
};
export { Geometry };
