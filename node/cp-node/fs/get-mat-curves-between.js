import { getMatCurveBetween } from './get-mat-curve-between.js';
function getMatCurvesBetween(cpNodeS, cpNodeE) {
    let cpNode = cpNodeS;
    const pss = [];
    while (cpNode !== cpNodeE) {
        const ps = getMatCurveBetween(cpNode, cpNode.next);
        pss.push(ps);
        cpNode = cpNode.next;
    }
    return pss;
}
export { getMatCurvesBetween };
//# sourceMappingURL=get-mat-curves-between.js.map