import type { Curve } from 'flo-boolean';
import type { CpNode } from '../cp-node/cp-node.js';
import type { CurvePiece } from './curve-piece.js';
import { comparePoss } from '../point-on-shape/compare-poss.js';


/**
 * Returns the ordered bezier pieces between the two given `CpNode`s.
 *
 * * NOTE: an earlier version 'stitched' pieces together at hole closers and
 * loop endpoints to avoid duplicate antipodal points later; this was removed
 * (duplicates are now checked for in `find2Prong`) - see the git history
 * before 2026-10 for that code.
 *
 * @param cpNodes - An ordered pair that represents the start and end points of
 * the boundary piece
 *
 * @internal
 */
function getBoundaryPieceBeziers(
        cpNodes: [CpNode,CpNode]): CurvePiece[] {

    let cpThis = cpNodes[0];
    const cpEnd  = cpNodes[1];

    const curvePieces: CurvePiece[] = [];

    // As opposed to going around the circle and taking the last exit
    let goStraight = true;
    do {
        const posThis = cpThis     .pointOnShape;
        const posNext = cpThis.next.pointOnShape;
        const curveThis = posThis.curve;
        const curveNext = posNext.curve;

        if (!goStraight) {
            goStraight = true;
            cpThis = cpThis.prevOnCircle;  // take last exit
            continue;
        }

        goStraight = false;

        if (curveNext === curveThis &&
            comparePoss(posNext, posThis) > 0) {

            // The boundary stays on the same curve segment *and* the next pos
            // is further along the *linear* boundary. If it is *not* further
            // on the *linear* boundary then this pos precedes the abrupt break
            // in the ordering and next pos comes after the break so the code in
            // the next `else` statement is called to skip over the break.
            // The other case in which `comparePoss(posNext, posThis) <= 0` is
            // possible for hole closers where the oderering of this and next
            // are the same except for `order2`
            curvePieces.push({
                curve: curveThis, ts: [posThis.t, posNext.t]
            });

            cpThis = cpThis.next;
            continue;
        }

        // The segment crosses a curve boundary because either:
        // 1. `this` and `next` are not on the same curve OR
        // 2. `this` comes after `next` by ordering
        // so split at t = 1.

        if (curveThis.loop === curveNext.loop) {
            curvePieces.push({
                curve: curveThis, ts: [posThis.t, 1]
            });

            // Fill in any curves skipped between the two points.
            addSkippedBeziers(curvePieces, curveThis, curveNext, posNext.t);
        }

        cpThis = cpThis.next;
    } while (cpThis !== cpEnd);

    return curvePieces;
}


/**
 * @internal
 * Adds pieces of skipped beziers
 */
function addSkippedBeziers(
        curvePieces: CurvePiece[],
        curveStart: Curve,
        curveEnd: Curve,
        t1: number) {

    // Walk forward through the loop until the end curve is reached.
    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        const tEnd = curveThis === curveEnd ? t1 : 1;
        curvePieces.push({ curve: curveThis, ts: [0, tEnd] });
    } while (curveThis !== curveEnd);
}


export { getBoundaryPieceBeziers }
