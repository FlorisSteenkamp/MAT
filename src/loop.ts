
import { Curve } from './curve';
    

/**
 * Represents a two-way linked loop of [[ICurve]]s - mostly used internally to 
 * conveniently represent shape boundaries.
 */
interface Loop {
    /** The curves that represent the shape boundary as an array. */
    curves: Curve[];
    /** A pre-ordered array of bezier curves to add initially.*/
    beziers: number[][][];
}


/**
 * @param beziers A pre-ordered array of bezier curves to add initially.
 */
function loopFromBeziers(beziers: number[][][] = []) {
    let curves: Curve[] = [];

    let loop: Loop = {
        beziers,
        curves
    };

    if (!beziers.length) { return loop; }

    let prev: Curve;
    
    for (let i=0; i<beziers.length; i++) {

        let curve: Curve = {
            loop,
            ps: beziers[i],
            prev,
            next: undefined,
            idx: i                
        };

        if (prev) { prev.next = curve; }
        prev = curve; 

        curves.push(curve);
    }

    // close loop
    let lastCurve = curves[curves.length-1];
    curves[0].prev = lastCurve;
    lastCurve.next = curves[0];

    return loop;
}


export { Loop, loopFromBeziers }
