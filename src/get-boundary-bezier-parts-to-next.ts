import { BezierPiece } from 'flo-bezier3';
import { CpNode } from './cp-node.js';
import { Curve  } from './curve.js';


/**
 * Returns the ordered bezier curves from this CpNode to the next CpNode 
 * on the boundary.
 * @param cpNode
 */
function getBoundaryBezierPartsToNext(cpNode: CpNode): BezierPiece[] {
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
    
    const bezierParts: BezierPiece[] = [];

    if (curveNext === curveThis) {
        bezierParts.push(
            { ps: posThis.curve.ps, ts: [posThis.t, posNext.t] }
        );
    } else {
        bezierParts.push(
            { ps: posThis.curve.ps, ts: [posThis.t, 1] }
        );
        
        addSkippedBeziers(
                bezierParts,
                posThis.curve, 
                posNext.curve,
                posNext.t
        );
    }				
        
    return bezierParts;
}


/**
 * @hidden
 * Adds pieces of skipped beziers.
 */
function addSkippedBeziers(
        bezierParts: { ps: number[][]; ts: number[] }[], 
        curveStart : Curve, 
        curveEnd   : Curve, 
        t1         : number) {

    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        const bezierPart = curveThis === curveEnd 
            ? { ps: curveThis.ps, ts: [0, t1] }
            : { ps: curveThis.ps, ts: [0, 1] }

        bezierParts.push(bezierPart);
    } while (curveThis !== curveEnd);


}


export { getBoundaryBezierPartsToNext }
