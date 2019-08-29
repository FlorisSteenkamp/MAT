
import { CpNode } from './cp-node/cp-node';
import { Curve  } from './curve';
import { fromTo, fromTTo1, from0ToT } from 'flo-bezier3';


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
            fromTo(posThis.curve.ps)(posThis.t, posNext.t)
        );
    } else {
        beziers.push(
            fromTTo1(posThis.curve.ps, posThis.t)
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
            from0ToT(curveThis.ps, tEnd) 
        );
    } while (curveThis !== curveEnd);
}


export { getBoundaryBeziersToNext }
