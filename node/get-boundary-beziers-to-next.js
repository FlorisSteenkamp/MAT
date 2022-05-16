// qqq import { fromTo, fromTTo1, from0ToT } from 'flo-bezier3';
import { fromTo } from 'flo-bezier3';
/**
 * Returns the ordered bezier curves from this CpNode to the next CpNode
 * on the boundary.
 * @param cpNode
 */
function getBoundaryBeziersToNext(cpNode) {
    let cpThis = cpNode;
    let cpNext = cpNode.next;
    let posThis = cpThis.cp.pointOnShape;
    let posNext = cpNext.cp.pointOnShape;
    let curveThis = posThis.curve;
    let curveNext = posNext.curve;
    if (curveThis.loop !== curveNext.loop) {
        // It is a hole-closer going over to the other loop - a kind of terminal
        // CpNode.
        return undefined;
    }
    let beziers = [];
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
 * @hidden
 */
function addSkippedBeziers(beziers, curveStart, curveEnd, t1) {
    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        let tEnd = curveThis === curveEnd ? t1 : 1;
        beziers.push(
        // qqq from0ToT(curveThis.ps, tEnd) 
        fromTo(curveThis.ps, 0, tEnd));
    } while (curveThis !== curveEnd);
}
export { getBoundaryBeziersToNext };
//# sourceMappingURL=get-boundary-beziers-to-next.js.map