"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Representation of one side of an intersection. The opposite side is at
 * X.opposite.
 */
class X {
    constructor(
        /**
         * The PointOnShape on the curve of the intersection. This side of the
         * intersection is represented by the incoming part of this curve.
         */
        pos, isDummy = false, 
        /** The opposite side of the intersection */
        opposite, loopTree, 
        //public inPs?     : number[][],
        outPs) {
        this.pos = pos;
        this.isDummy = isDummy;
        this.opposite = opposite;
        this.loopTree = loopTree;
        this.outPs = outPs;
    }
}
exports.X = X;
//# sourceMappingURL=x.js.map