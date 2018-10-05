import { ILoopTree } from './svg/fs/simplify-paths/i-loop-tree';
import { PointOnShape } from './point-on-shape';
/**
 * Representation of one side of an intersection. The opposite side is at
 * X.opposite.
 */
declare class X {
    /**
     * The PointOnShape on the curve of the intersection. This side of the
     * intersection is represented by the incoming part of this curve.
     */
    pos: PointOnShape;
    isDummy: boolean;
    /** The opposite side of the intersection */
    opposite: X;
    loopTree: ILoopTree;
    outPs: number[][];
    constructor(
        /**
         * The PointOnShape on the curve of the intersection. This side of the
         * intersection is represented by the incoming part of this curve.
         */
        pos: PointOnShape, isDummy?: boolean, 
        /** The opposite side of the intersection */
        opposite?: X, loopTree?: ILoopTree, outPs?: number[][]);
}
export { X };
