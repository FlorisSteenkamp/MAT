import { allRoots, deflate } from 'flo-poly';
import { evalDeCasteljau, getFootpointPoly } from 'flo-bezier3';
import { Curve } from "../curve/curve.js";
import { eAdd, growExpansion } from 'big-float-ts';


/**
 * @internal
 * @param curve The curve
 * @param p The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
function closestPointsOnCurve(
        curve: Curve, 
        p: number[], 
        [tS,tE]: number[] = [0,1], 
        touchedCurve: Curve,
        t: number): {
            p: number[];
            t: number;
        }[] {

    const _poly = getFootpointPoly(curve.ps, p);

    const poly = curve === touchedCurve
        ? deflate(_poly, t)
        : _poly;

    const roots = allRoots(poly, tS, tE);

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

    if (tS === 0) {
        if (push0) { roots.push(0); }
    } else if (tS === 1) {
        if (push1) { roots.push(1); }
    } else {
        roots.push(tS);
    }

    if (tE === 0) {
        if (push0) { roots.push(0); }
    } else if (tE === 1) {
        if (push1) { roots.push(1); }
    } else {
        roots.push(tE);
    }

    const ps = roots.map(
        r => { 
            const t = r < 0 ? 0 : r > 1 ? 1 : r;
            return { p: evalDeCasteljau(curve.ps,t), t }
        }
    );

    return ps;
}


export { closestPointsOnCurve }
