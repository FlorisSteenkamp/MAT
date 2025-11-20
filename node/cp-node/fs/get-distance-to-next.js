import { totalLength } from "flo-bezier3";
import { memoize } from "flo-memoize";
import { getMatCurveToNext } from "./get-mat-curve-to-next.js";
function getMatDistanceToNext(cpNode) {
    const ps = getMatCurveToNext(cpNode);
    const l = totalLength(ps);
    return l;
}
const getMatDistanceToNext$ = memoize(getMatDistanceToNext);
export { getMatDistanceToNext, getMatDistanceToNext$ };
//# sourceMappingURL=get-distance-to-next.js.map