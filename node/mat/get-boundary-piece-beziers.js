import { isPosQuiteSharpCorner } from '../point-on-shape/is-pos-quite-sharp-corner.js';
import { compareCps } from '../contact-point.js';
/**
 * @internal
 * Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
 * from the given boundary piece.
 * @param cpNodes - An ordered pair that represents the start and end points of
 * the boundary piece
 */
function getBoundaryPieceBeziers(cpNodes) {
    let cpThis = cpNodes[0];
    const cpEnd = cpNodes[1];
    const bezierPieces = [];
    // As opposed to going around the circle and taking the last exit
    let goStraight = true;
    do {
        if (!goStraight) {
            goStraight = true;
            cpThis = cpThis.prevOnCircle; // take last exit
            continue;
        }
        goStraight = false;
        const posThis = cpThis.cp.pointOnShape;
        const posNext = cpThis.next.cp.pointOnShape;
        if (posNext.curve === posThis.curve &&
            //PointOnShape.isQuiteSharpCorner(posThis) && 
            //PointOnShape.isQuiteSharpCorner(posNext)) {
            isPosQuiteSharpCorner(posThis) &&
            isPosQuiteSharpCorner(posNext)) {
            // Do nothing
        }
        else if (posNext.curve === posThis.curve &&
            compareCps(cpThis.next.cp, cpThis.cp) > 0) {
            bezierPieces.push({ curve: posThis.curve, ts: [posThis.t, posNext.t] });
        }
        else {
            bezierPieces.push({ curve: posThis.curve, ts: [posThis.t, 1] });
            if (cpThis.cp.pointOnShape.curve.loop === cpThis.next.cp.pointOnShape.curve.loop) {
                addSkippedBeziers(bezierPieces, posThis.curve, posNext.curve, posNext.t);
            }
        }
        cpThis = cpThis.next;
    } while (cpThis !== cpEnd);
    return bezierPieces;
}
/**
 * @internal
 * Adds pieces of skipped beziers
 */
function addSkippedBeziers(bezierPieces, curveStart, curveEnd, t1) {
    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        const tEnd = curveThis === curveEnd ? t1 : 1;
        bezierPieces.push({ curve: curveThis, ts: [0, tEnd] });
    } while (curveThis !== curveEnd);
}
export { getBoundaryPieceBeziers };
//# sourceMappingURL=get-boundary-piece-beziers.js.map