import type { Curve } from 'flo-boolean';
import type { CpNode } from '../cp-node/cp-node.js';
import type { CurvePiece } from './curve-piece.js';
import { comparePoss } from '../point-on-shape/compare-poss.js';


/**
 * Returns the ordered bezier pieces between from the given boundary piece.
 * 
 * @param cpNodes - An ordered pair that represents the start and end points of 
 * the boundary piece
 * 
 * @internal
 */
function getBoundaryPieceBeziers(
        cpNodes: CpNode[]): CurvePiece[] {

    let cpThis = cpNodes[0]; 
    const cpEnd  = cpNodes[1];
    
    const curvePieces: CurvePiece[] = [];

    // NOTE❗ Currently removed stichables; we're just checking for duplicates
    // later in `find2Prong`; KEEP for possible future use.
    // We have to stich curves together if they're at a hole closer or at the
    // endpoints of a loop to avoid duplicates later within the code; the map
    // is from curves
    // const stichables: Map<Curve, number[]> = new Map();

    // As opposed to going around the circle and taking the last exit
    let goStraight = true; 
    do {
        const posThis = cpThis     .pointOnShape;
        const posNext = cpThis.next.pointOnShape;
        const curveThis = posThis.curve;
        const curveNext = posNext.curve;

        if (!goStraight) {
            goStraight = true;
            // NOTE❗ Currently removed stichables; we're just checking for duplicates
            // later in `find2Prong`; KEEP for possible future use.
            // const { loop: loopThis } = curveThis;
            // const cpPrevOnCircle = cpThis.prevOnCircle;
            // const curvePrevOnCircle = cpPrevOnCircle.pointOnShape.curve;
            // const { loop: loopNext } = cpPrevOnCircle.pointOnShape.curve;
            

            // if (loopThis !== loopNext) {
            //     let idxsThis = stichables.get(curveThis);
            //     if (idxsThis === undefined) {
            //         idxsThis = [];
            //         stichables.set(curveThis, idxsThis);
            //     }
            //     idxsThis.push(curvePieces.length - 1);  // last `CurvePiece` idx

            //     let idxsNext = stichables.get(curvePrevOnCircle);
            //     if (idxsNext === undefined) {
            //         idxsNext = [];
            //         stichables.set(curvePrevOnCircle, idxsNext);
            //     }
            //     idxsNext.push(curvePieces.length);  // upcoming `CurvePiece` idx
            // }

            // cpThis = cpPrevOnCircle;  // take last exit
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
            const initialCurvePiece = {
                curve: curveThis, ts: [posThis.t, 1]
            };
            curvePieces.push(initialCurvePiece);

            // Fill in any curves skipped between the two points.
            addSkippedBeziers(curvePieces, curveThis, curveNext, posNext.t);

            // NOTE❗ Currently removed stichables; we're just checking for duplicates
            // later in `find2Prong`; KEEP for possible future use.
            // const finalCurvePiece = curvePieces[curvePieces.length - 1];
            // if (initialCurvePiece.curve === finalCurvePiece!.curve) {
            //     const { ts: tsS } = initialCurvePiece;
            //     const { ts: tsE } = finalCurvePiece!;

            //     // If it is a closed loop we must join the endpoints to prevent duplicate
            //     // antipodal points later
            //     if (tsS[0] === tsE[1]) {
            //         initialCurvePiece.ts[0] = tsE[0];

            //         if (curvePieces.length > 1) {
            //             curvePieces.pop();
            //         }
            //         // console.log('was inner closed loop')
            //     }
            // }
        }

        cpThis = cpThis.next;
    } while (cpThis !== cpEnd);

    // NOTE❗ Currently removed stichables; we're just checking for duplicates
    // later in `find2Prong`; KEEP for possible future use.
    // if (stichables.size > 0) {
    //     for (const [loop,idxs] of stichables.entries()) {
    //         if (idxs.length === 2) {
    //             const curvePieceS = curvePieces[idxs[0]]!;
    //             const curvePieceE = curvePieces[idxs[1]]!;

    //             if (curvePieceS === undefined || curvePieceE === undefined) {
    //                 console.log(curvePieceS);
    //                 console.log(curvePieceE);
    //                 continue;
    //             }

    //             const { curve: curveS, ts: tsS } = curvePieceS;
    //             const { curve: curveE, ts: tsE } = curvePieceE;
    //             if (curveS !== curveE) {
    //                 continue;
    //             }

    //             // If it is a closed loop we must join the endpoints to prevent duplicate
    //             // antipodal points later
    //             if (tsS[0] === tsE[1]) {
    //                 curvePieceS.ts[0] = tsE[0];
    //                 // console.log('was closed loop 1')
    //             } else if (tsE[0] === tsS[1]) {
    //                 curvePieceS.ts[1] = tsE[1];
    //                 // console.log('was closed loop 2')
    //             }
    //             if (idxs[0] !== idxs[1]) {
    //                 curvePieces[idxs[1]] = undefined;
    //             }
    //         }
    //     }
    // }

    // NOTE❗ The below endcurve check is not enough for specific cases involving
    // multiple hole closers; KEEP for now but must use stichables instead
    // if (curvePieces[0]!.curve === curvePieces[curvePieces.length - 1]!.curve) {
    //     const { ts: tsS } = curvePieces[0]!;
    //     const { ts: tsE } = curvePieces[curvePieces.length - 1]!;

    //     // If it is a closed loop we must join the endpoints to prevent duplicate
    //     // antipodal points later
    //     if (tsS[0] === tsE[1]) {
    //         curvePieces[0]!.ts[0] = tsE[0];

    //         if (curvePieces.length > 1) {
    //             curvePieces.pop();
    //         }
    //         // console.log('was closed loop')
    //     }
    // }

    return curvePieces;
}


/**
 * @internal
 * Adds pieces of skipped beziers
 */
function addSkippedBeziers(
        curvePieces: (CurvePiece | undefined)[], 
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
