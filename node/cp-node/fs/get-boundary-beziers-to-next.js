import { fromTo } from 'flo-bezier3';
function getBoundaryBeziersToNext(cpNode) {
    const cpThis = cpNode;
    const cpNext = cpNode.next;
    const posThis = cpThis.cp.pointOnShape;
    const posNext = cpNext.cp.pointOnShape;
    const curveThis = posThis.curve;
    const curveNext = posNext.curve;
    if (curveThis.loop !== curveNext.loop) {
        // It is a hole-closer going over to the other loop - a kind of terminal
        // CpNode.
        // return undefined!;
        return [];
    }
    const beziers = [];
    if (curveNext === curveThis) {
        beziers.push(fromTo(posThis.curve.ps, posThis.t, posNext.t));
    }
    else {
        beziers.push(fromTo(posThis.curve.ps, posThis.t, 1));
        addSkippedBeziers(beziers, posThis.curve, posNext.curve, posNext.t);
    }
    return beziers;
}
/**
 * Adds pieces of skipped beziers.
 * @internal
 */
function addSkippedBeziers(beziers, curveStart, curveEnd, t1) {
    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        const tEnd = curveThis === curveEnd ? t1 : 1;
        beziers.push(
        // qqq from0ToT(curveThis.ps, tEnd) 
        fromTo(curveThis.ps, 0, tEnd));
    } while (curveThis !== curveEnd);
}
export { getBoundaryBeziersToNext };
//# sourceMappingURL=get-boundary-beziers-to-next.js.map