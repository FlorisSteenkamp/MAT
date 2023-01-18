// qqq import { deflateQuad, allRootsMultiWithErrBounds, RootInterval } from 'flo-poly';
// qqq import { getTangentPolyFromPointExact, evalDeCasteljau, evaluate, getFootpointPolyExact } from 'flo-bezier3';
import { ddDeflate, allRootsCertified } from 'flo-poly';
import { evaluate, getFootpointPolyDd } from 'flo-bezier3';
/**
 * @hidden
 * @param curve The curve
 * @param p The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
function closestPointsOnCurve(curve, p, [tS, tE] = [0, 1], touchedCurve, t) {
    // qqq let poly = getTangentPolyFromPointExact(curve.ps, p);
    const _poly = getFootpointPolyDd(curve.ps, p);
    // qqq poly = deflateQuad(poly, t);
    const poly = curve === touchedCurve
        ? ddDeflate(_poly, t)
        : _poly;
    // let roots: Omit<RootInterval,'multiplicity'>[] = allRootsMultiWithErrBounds(
    const roots = allRootsCertified(poly, tS, tE);
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
        if (push0) {
            roots.push({ tS: 0, tE: 0 });
        }
    }
    else if (tS === 1) {
        if (push1) {
            roots.push({ tS: 1, tE: 1 });
        }
    }
    else {
        roots.push({ tS: tS, tE: tS });
    }
    if (tE === 0) {
        if (push0) {
            roots.push({ tS: 0, tE: 0 });
        }
    }
    else if (tE === 1) {
        if (push1) {
            roots.push({ tS: 1, tE: 1 });
        }
    }
    else {
        roots.push({ tS: tE, tE: tE });
    }
    const ps = roots.map(root => {
        const tS = root.tS;
        const tE = root.tE;
        // TODO - tS, tE should always stay within [0,1] - modify findRootsMulti
        const t = tS < 0
            ? 0
            : tE > 1 ? 1 : (tS + tE) / 2;
        // TODO - why does evalDeCasteljau not work here?
        return { p: evaluate(curve.ps, t), t };
        //return { p: evalDeCasteljau(curve.ps,t), t }
    });
    return ps;
}
export { closestPointsOnCurve };
//# sourceMappingURL=closest-points-on-curve.js.map