import { allRootsCertified, RootInterval } from 'flo-poly';
import { evalDeCasteljauDd, getFootPointsOnBezierPolysCertified } from 'flo-bezier3';
import { Curve } from "../curve/curve.js";
import { ddDeflateWithRunningError } from './dd-deflate-with-running-error.js';
import { eDeflate } from './e-deflate.js';


/**
 * @internal
 * @param curve The curve
 * @param p The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
function closestPointsOnCurveCertified(
        angle: number,
        curve: Curve, 
        p: number[], 
        [tS,tE]: number[] = [0,1], 
        touchedCurve: Curve,
        t: number): {
            p: number[];
            t: number;
        }[] {

    const { polyDd: _polyDd, polyE: _polyE, getPolyExact: _getPolyExact } =
        getFootPointsOnBezierPolysCertified(curve.ps, p);
    const shouldDeflate = angle === 0 && curve === touchedCurve;
    const deflatedPoly = shouldDeflate
        ? ddDeflateWithRunningError(_polyDd, _polyE, t)
        : undefined;
    const { polyDd, polyE, getPolyExact } = shouldDeflate
        ? {
            polyDd: deflatedPoly!.coeffs,
            polyE: deflatedPoly!.errBound,
            getPolyExact: () => eDeflate(_getPolyExact(), t)
        }
        : { polyDd: _polyDd, polyE: _polyE, getPolyExact: _getPolyExact };
    //const { polyDd, polyE, getPolyExact } =
    //    getFootPointsOnBezierPolysCertified(curve.ps, p);

    const ris = allRootsCertified(polyDd, tS, tE, polyE, getPolyExact);

    const dontPush0 = (
        (t === 1 && curve === touchedCurve.next) ||
        (t === 0 && curve === touchedCurve)
    );
    const dontPush1 = (
        (t === 0 && curve === touchedCurve.prev) ||
        (t === 1 && curve === touchedCurve)
    );

    if (tS === 0) {
        if (!dontPush0) { ris.push({ tS: 0, tE: 0, multiplicity: 1 }); }
    } else if (tS === 1) {
        if (!dontPush1) { ris.push({ tS: 1, tE: 1, multiplicity: 1 }); }
    } else {
        ris.push({ tS: tS, tE: tS, multiplicity: 1 });
    }

    if (tE === 0) {
        if (!dontPush0) { ris.push({ tS: 0, tE: 0, multiplicity: 1 }); }
    } else if (tE === 1) {
        if (!dontPush1) { ris.push({ tS: 1, tE: 1, multiplicity: 1 }); }
    } else {
        ris.push({ tS: tE, tE: tE, multiplicity: 1 });
    }

    return ris.map(ri => {
        const { tS: ts, tE: te } = ri;
        const _t = (ts + te)/2;
        const t = _t < 0 ? 0 : _t > 1 ? 1 : _t;

        return {
            p: evalDeCasteljauDd(curve.ps,[0,t]).map(v => v[1]),
            t: t
        };
    });
}


export { closestPointsOnCurveCertified }
