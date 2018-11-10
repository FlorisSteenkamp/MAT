"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_bezier3_1 = require("flo-bezier3");
/**
 * Returns the ordered cubic bezier curves from this CpNode to the next CpNode
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
        beziers.push(flo_bezier3_1.fromTo(posThis.curve.ps)(posThis.t, posNext.t));
    }
    else {
        beziers.push(flo_bezier3_1.fromTTo1(posThis.curve.ps, posThis.t));
        addSkippedBeziers(beziers, posThis.curve, posNext.curve, posNext.t);
    }
    return beziers;
}
exports.getBoundaryBeziersToNext = getBoundaryBeziersToNext;
/**
 * Adds pieces of skipped beziers.
 * @private
 */
function addSkippedBeziers(beziers, curveStart, curveEnd, t1) {
    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        let tEnd = curveThis === curveEnd ? t1 : 1;
        beziers.push(flo_bezier3_1.from0ToT(curveThis.ps, tEnd));
    } while (curveThis !== curveEnd);
}
//# sourceMappingURL=get-boundary-beziers-to-next.js.map