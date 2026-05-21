import type { BezierPiece } from 'flo-bezier3';
import type { CpNode } from '../cp-node.js';
import type { Curve  } from '../../curve/curve.js';


/**
 * Returns the boundary beziers pieces between this `CpNode` and the next
 * one.
 * 
 * * returns `undefined` if the next `CpNode` is on a different loop,
 * as this is a hole-closer and there are no boundary beziers between them.
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
