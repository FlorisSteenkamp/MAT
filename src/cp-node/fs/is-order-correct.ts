import type { CpNode } from "../cp-node.js";
import { RbTree } from "flo-ll-rb-tree";
import { PointOnShape } from "../../point-on-shape/point-on-shape.js";
import { comparePoss } from "../../point-on-shape/compare-poss.js";


/**
 * 
 * @param cpTree 
 * @param pos 
 * @param succ 
 * @param alreadyInserted set to `true` if the given `pos` has already been
 * inserted, `false` otherwise.
 */
function isOrderCorrect(
        cpTree: RbTree<CpNode>,
        pred: CpNode,
        pos: PointOnShape,
        succ: CpNode,
        alreadyInserted: boolean): boolean {

    if (cpTree.size <= (alreadyInserted ? 2 : 1)) {
        return true;
    }

    const a = pred.pointOnShape;
    const b = pos;
    const c = succ.pointOnShape;

    // Let a = pred, b = pos, and c = succ.
    // For a cyclic order we need:
    // `(a < b && b < c)` || `(b < c && c < a)` || `(c < a && a < b)`
    // Let `X = a < b, Y = b < c, Z = c < a` then
    // `(X && Y)` || `(Y && Z)` || `(Z && X)`

    const _X = comparePoss(a, b);
    if (_X === 0) {  // two points must have different order
        // console.log('aaa');
        return false;
    }  
    const _Y = comparePoss(b, c);
    if (_Y === 0) {  // two points must have different order
        // console.log('bbb');
        return false;
    }  
    const _Z = comparePoss(c, a);
    if (_Z === 0) {
        // console.log('bbb');
        return false;
    }  // impossible anyway at this point

    // Now neither `_X` nor `_Y` nor `_Z` === `0`
    const X = _X < 0;
    const Y = _Y < 0;
    const Z = _Z < 0;

    // Cyclic order condition
    if ((X && Y) || (Y && Z) || (Z && X)) { return true; }

    // console.log(_X, _Y, _Z);
    // console.log(cpTree.toArr().map(v => {
    //     return {
    //         curveIdx: v.pointOnShape.curve.idx,
    //         t: v.pointOnShape.t,
    //         order: v.pointOnShape.order,
    //         order2: v.pointOnShape.order2
    //     }
    // }));

    return false;
}


export { isOrderCorrect }
