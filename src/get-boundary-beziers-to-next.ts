// qqq import { fromTo, fromTTo1, from0ToT } from 'flo-bezier3';
import { fromTo } from 'flo-bezier3';
import { CpNode } from './cp-node.js';
import { Curve  } from './curve.js';


/**
 * Returns the ordered bezier curves from this CpNode to the next CpNode 
 * on the boundary.
 * @param cpNode
 */
function getBoundaryBeziersToNext(cpNode: CpNode) {
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
        beziers.push(
            // fromTo(posThis.curve.ps)(posThis.t, posNext.t)
            fromTo(posThis.curve.ps, posThis.t, posNext.t).ps
        );
    } else {
        beziers.push(
            // fromTTo1(posThis.curve.ps, posThis.t)
            fromTo(posThis.curve.ps, posThis.t, 1).ps
        );
        
        addSkippedBeziers(
                beziers, 
                posThis.curve, 
                posNext.curve,
                posNext.t
        );
    }				
        
    return beziers;
}


/**
 * Adds pieces of skipped beziers.
 * @hidden
 */
function addSkippedBeziers(
        beziers    : number[][][], 
        curveStart : Curve, 
        curveEnd   : Curve, 
        t1         : number) {

    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        let tEnd = curveThis === curveEnd ? t1 : 1;
        beziers.push( 
            // qqq from0ToT(curveThis.ps, tEnd) 
            fromTo(curveThis.ps, 0, tEnd).ps
        );
    } while (curveThis !== curveEnd);
}


export { getBoundaryBeziersToNext }
