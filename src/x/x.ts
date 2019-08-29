
import { ILoopTree } from '../svg/fs/simplify-paths/i-loop-tree';
import { PointOnShape } from '../point-on-shape';


/** 
 * @hidden
 * Representation of one side of an intersection. The opposite side is at 
 * X.opposite.
 */
class X {
    constructor(
        /** 
         * The PointOnShape on the curve of the intersection. This side of the 
         * intersection is represented by the incoming part of this curve. 
         */
        public pos       : PointOnShape,
        public isDummy   : boolean = false,
        /** The opposite side of the intersection */
        public opposite? : X,
        public loopTree? : ILoopTree,
        //public inPs?     : number[][],
        public outPs?    : number[][]) {
    }
}


export { X }
