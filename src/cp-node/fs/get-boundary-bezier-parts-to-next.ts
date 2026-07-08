import type { BezierPiece } from 'flo-bezier3';
import type { Curve } from 'flo-boolean';
import type { CpNode } from '../cp-node.js';


/**
 * Returns the ordered `BezierPiece`s from this `CpNode` to the next `CpNode` 
 * on the boundary.
 * 
 * * returns `[]` if (and only if) the next `CpNode` is on a different loop;
 * this differs from "returns `[]` if (and only if) the next `CpNode` is a
 * hole-closer" as half of hole-closers are on the same loop.
 * 
 * @param cpNode
 */
function getBoundaryBezierPartsToNext(
        cpNode: CpNode): BezierPiece[] {

    const cpThis = cpNode; 
    const cpNext = cpNode.next;

    const posThis = cpThis.cp.pointOnShape;
    const posNext = cpNext.cp.pointOnShape;

    const curveThis = posThis.curve;
    const curveNext = posNext.curve;

    if (curveThis.loop !== curveNext.loop) {
        // It is a hole-closer going over to the other loop - a kind of terminal
        // CpNode.
        // return undefined;
        return [];
    }
    
    const bezierPieces: BezierPiece[] = [];

    if (curveNext === curveThis) {
        bezierPieces.push(
            { ps: posThis.curve.ps, ts: [posThis.t, posNext.t] }
        );
    } else {
        bezierPieces.push(
            { ps: posThis.curve.ps, ts: [posThis.t, 1] }
        );
        
        addSkippedBezierPiecess(
            bezierPieces,
            posThis.curve,
            posNext.curve,
            posNext.t
        );
    }

    return bezierPieces;
}


/**
 * Adds pieces of skipped beziers.
 * @internal
 */
function addSkippedBezierPiecess(
        bezierPieces: BezierPiece[],
        curveStart: Curve,
        curveEnd: Curve,
        t1: number) {

    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        const tEnd = curveThis === curveEnd ? t1 : 1;
        bezierPieces.push({
            ps: curveThis.ps, ts: [0, tEnd]
        });
    } while (curveThis !== curveEnd);
}


export { getBoundaryBezierPartsToNext }
