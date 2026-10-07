import { totalLength } from "flo-bezier3";
import { memoize } from "flo-memoize";
import { CpNode } from "../cp-node.js";
import { getMatCurveToNext } from "./get-mat-curve-to-next.js";


function getMatDistanceToNext(
        cpNode: CpNode) {

    let l = 0;
    for (const ps of getMatCurveToNext(cpNode)) {
        l += totalLength(ps);
    }

    return l;
}


const getMatDistanceToNext$ = memoize(getMatDistanceToNext)

export { getMatDistanceToNext, getMatDistanceToNext$ }
