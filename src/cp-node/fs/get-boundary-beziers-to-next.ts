import type { CpNode } from '../cp-node.js';
import { fromTo } from 'flo-bezier3';
import { getBoundaryBezierPartsToNext } from './get-boundary-bezier-parts-to-next.js';


/**
 * Returns the ordered bezier curves from this `CpNode` to the next `CpNode` 
 * on the boundary.
 * @param cpNode
 */
function getBoundaryBeziersToNext(
        cpNode: CpNode): number[][][] {

    return getBoundaryBezierPartsToNext(cpNode).map(
        bp => fromTo(bp.ps, bp.ts[0], bp.ts[1])
    );
}


// /**
//  * Returns the boundary beziers between this `CpNode` and the next
//  * one.
//  * 
//  * * returns `[]` if the next `CpNode` is on a different loop,
//  * as this is a hole-closer and there are no boundary beziers between them.
//  * 
//  * @param cpNode 
//  */
// function getBoundaryBeziersToNext(
//         cpNode: CpNode): number[][][] {

//     const cpThis = cpNode; 
//     const cpNext = cpNode.next;

//     const posThis = cpThis.cp.pointOnShape;
//     const posNext = cpNext.cp.pointOnShape;

//     const curveThis = posThis.curve;
//     const curveNext = posNext.curve;

//     if (curveThis.loop !== curveNext.loop) {
//         // It is a hole-closer going over to the other loop - a kind of terminal
//         // CpNode.
//         // return undefined!;
//         return [];
//     }

//     const beziers: number[][][] = [];

//     if (curveNext === curveThis) {
//         beziers.push(
//             fromTo(posThis.curve.ps, posThis.t, posNext.t)
//         );
//     } else {
//         beziers.push(
//             fromTo(posThis.curve.ps, posThis.t, 1)
//         );
        
//         addSkippedBeziers(
//             beziers,
//             posThis.curve,
//             posNext.curve,
//             posNext.t
//         );
//     }

//     return beziers;
// }


// /**
//  * Adds pieces of skipped beziers.
//  * @internal
//  */
// function addSkippedBeziers(
//         beziers: number[][][],
//         curveStart: Curve,
//         curveEnd: Curve,
//         t1: number) {

//     let curveThis = curveStart;
//     do {
//         curveThis = curveThis.next;
//         const tEnd = curveThis === curveEnd ? t1 : 1;
//         beziers.push( 
//             fromTo(curveThis.ps, 0, tEnd)
//         );
//     } while (curveThis !== curveEnd);
// }


export { getBoundaryBeziersToNext }
