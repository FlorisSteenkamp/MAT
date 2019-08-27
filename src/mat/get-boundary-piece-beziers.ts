
import { CpNode } from '../cp-node/cp-node';
import { Curve         } from '../curve';

import { BezierPiece  } from '../bezier-piece';
import { PointOnShape } from '../point-on-shape';
import { ContactPoint } from '../contact-point';


/**
* Returns the ordered cubic bezier pieces (i.e a bezier with a t range) 
* from the given boundary piece.
* @param cpNodes - An ordered pair that represents the start and end points of 
* the boundary piece
*/
function getBoundaryPieceBeziers(cpNodes: CpNode[]): BezierPiece[] {
    let cpThis = cpNodes[0]; 
    let cpEnd  = cpNodes[1];
    
    let bezierPieces = [];

    // As opposed to going around the circle and taking the last exit
    let goStraight = true; 
    do {
        if (!goStraight) {
            goStraight = true;
            cpThis = cpThis.prevOnCircle; // take last exit
            continue;
        }

        goStraight = false;
        
        let posThis = cpThis     .cp.pointOnShape;
        let posNext = cpThis.next.cp.pointOnShape;

        if (posNext.curve === posThis.curve && 
            PointOnShape.isQuiteSharpCorner(posThis) && 
            PointOnShape.isQuiteSharpCorner(posNext)) {

            // Do nothing
        } else if (posNext.curve === posThis.curve &&
                   ContactPoint.compare(cpThis.next.cp, cpThis.cp) > 0) {
                
            bezierPieces.push(
                new BezierPiece(posThis.curve, [posThis.t, posNext.t])
            );
        } else {
            bezierPieces.push(
                new BezierPiece(posThis.curve, [posThis.t, 1])
            );
            
            if (cpThis.cp.pointOnShape.curve.loop === cpThis.next.cp.pointOnShape.curve.loop) {
                addSkippedBeziers(
                        bezierPieces, 
                        posThis.curve, 
                        posNext.curve,
                        posNext.t
                );
            }
        }				
        
        cpThis = cpThis.next;
    } while (cpThis !== cpEnd);


    return bezierPieces;
}


/**
 * Adds pieces of skipped beziers
 */
function addSkippedBeziers(
        bezierPieces : BezierPiece[], 
        curveStart   : Curve, 
        curveEnd     : Curve, 
        t1           : number) {

    let curveThis = curveStart;
    do {
        curveThis = curveThis.next;
        let tEnd = curveThis === curveEnd ? t1 : 1;
        bezierPieces.push( new BezierPiece(curveThis, [0, tEnd]) );
    } while (curveThis !== curveEnd);
}


export { getBoundaryPieceBeziers }
