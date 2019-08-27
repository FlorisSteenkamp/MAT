
import { deflate, allRoots } from 'flo-poly';

import { getObjClosestTo } from 'flo-vector2d';
import { evaluate, getTangentPolyFromPoint } from 'flo-bezier3';

import { Curve } from "../../curve";


let DELTA = 1e-11;


/**
 * 
 * @param curve The bezier
 * @param p The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
function closestPointOnCurve(
        curve: Curve, 
        p: number[], 
        tRange: number[] = [0,1], 
        touchedCurve?: Curve,
        t?: number) {

    let poly = getTangentPolyFromPoint(curve.ps, p);

    if (curve === touchedCurve) {		
        poly = deflate(poly, t);
    }

    let roots = allRoots(poly, tRange[0], tRange[1]); 

    // Also test the endpoints
    let push0 = true;
    let push1 = true;
    if ((t === 1 && curve === touchedCurve.next) ||
        (t === 0 && curve === touchedCurve)) {
        push0 = false;
    }
    if ((t === 0 && curve === touchedCurve.prev) ||
        (t === 1 && curve === touchedCurve)) {
        push1 = false;
    }

    if (tRange[0] === 0) {
        if (push0) { roots.push(0); }
    } else if (tRange[0] === 1) {
        if (push1) { roots.push(1); }
    } else {
        roots.push(tRange[0]);
    }

    if (tRange[1] === 0) {
        if (push0) { roots.push(0); }
    } else if (tRange[1] === 1) {
        if (push1) { roots.push(1); }
    } else {
        roots.push(tRange[1]);
    }

    // This is to take care of a numerical issue - see shape p1.svg.
    let roots_: number[] = [];
    for (let i=0; i<roots.length; i++) {
        let root = roots[i];
        if (root !== 0 && root < DELTA) {
            root = 0;
        } else if (root !== 1 && 1-root < DELTA) {
            root = 1;
        }
        roots_.push(root);
    }

    let ev = evaluate(curve.ps);
    let ps = roots_.map(
    //let ps = roots.map(
        root => ({ p: ev(root), t: root })
    );

    return getObjClosestTo(p, ps, p => p.p);
}


export { closestPointOnCurve }
