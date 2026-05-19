/**
 * Returns the boundary beziers pieces between this `CpNode` and the next
 * one.
 *
 * * returns `undefined` if the next `CpNode` is on a different loop,
 * as this is a hole-closer and there are no boundary beziers between them.
 *
 * @param cpNode
 */
function getBoundaryBezierPartsToNext(cpNode) {
    const cpThis = cpNode;
    const cpNext = cpNode.next;
    const posThis = cpThis.cp.pointOnShape;
    const posNext = cpNext.cp.pointOnShape;
    const curveThis = posThis.curve;
    const curveNext = posNext.curve;
    if (curveThis.loop !== curveNext.loop) {
        // It is a hole-closer going over to the other loop - a kind of terminal
        // CpNode.
        return undefined;
    }
    const bezierPieces = [];
    if (curveNext === curveThis) {
        bezierPieces.push({
            ps: posThis.curve.ps,
            ts: [posThis.t, posNext.t]
        });
    }
    else {
        bezierPieces.push({
            ps: posThis.curve.ps,
            ts: [posThis.t, 1]
        });
        addSkippedBeziers(bezierPieces, posThis.curve, posNext.curve, posNext.t);
    }
    return bezierPieces;
}
/**
 * @internal
 * Adds pieces of skipped beziers.
 */
function addSkippedBeziers(bezierPieces, curveStart, curveEnd, t1) {
    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        const bezierPart = curveThis === curveEnd
            ? { ps: curveThis.ps, ts: [0, t1] }
            : { ps: curveThis.ps, ts: [0, 1] };
        bezierPieces.push(bezierPart);
    } while (curveThis !== curveEnd);
}
export { getBoundaryBezierPartsToNext };
//# sourceMappingURL=get-boundary-bezier-parts-to-next.js.map