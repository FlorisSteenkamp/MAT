/*import { Curve } from './curve.js';
import { Loop } from 'flo-boolean';
import { isReallyPoint } from 'flo-bezier3';


/**
 * Represents a two-way linked loop of [[ICurve]]s - mostly used internally to 
 * conveniently represent shape boundaries.
 */
// interface Loop {
//     /** The curves that represent the shape boundary as an array. */
//     curves: Curve[];
//     /** A pre-ordered array of bezier curves to add initially.*/
//     beziers: number[][][];
// }


/**
 * @param beziers A pre-ordered array of bezier curves to add initially.
 */
/*
function loopFromBeziers(
        beziers: number[][][] = [],
        idx: number) {

    const curves: Curve[] = [];

    const loop: Loop = { beziers, curves, idx };

    if (!beziers.length) { return loop; }

    let prev: Curve | undefined = undefined;
    
    let j = 0;
    for (let i=0; i<beziers.length; i++) {

        if (isReallyPoint(beziers[i])) { continue; }

        const curve: Curve = {
            loop,
            ps: beziers[i],
            prev: prev!,
            next: undefined!,
            idx: j
        };

        if (prev!) { prev.next = curve; }
        prev = curve; 

        curves.push(curve);
        j++;
    }

    // close loop
    const lastCurve = curves[curves.length-1];
    curves[0].prev = lastCurve;
    lastCurve.next = curves[0];

    lastCurve.ps[lastCurve.ps.length-1] = curves[0].ps[0];

    return loop;
}


export { Loop, loopFromBeziers }
*/
