import { memoize } from 'flo-memoize';
import { getMatCurveBetween } from './get-mat-curve-between.js';
function getMatCurveToNext(cpNode) {
    return getMatCurveBetween(cpNode, cpNode.next);
}
const getMatCurveToNext$ = memoize(getMatCurveToNext);
export { getMatCurveToNext, getMatCurveToNext$ };
//# sourceMappingURL=get-mat-curve-to-next.js.map