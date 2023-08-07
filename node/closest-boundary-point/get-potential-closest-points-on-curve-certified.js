import { allRootsCertified } from 'flo-poly';
import { getFootPointsOnBezierPolysCertified, getIntervalBox } from 'flo-bezier3';
import { ddDeflateWithRunningError } from './dd-deflate-with-running-error.js';
import { eDeflate } from 'flo-poly';
import { γγ } from '../error-analysis/gamma.js';
import { rootIntervalToDistanceSquaredInterval } from './root-interval-to-distance-squared-interval.js';
import { getPFromBox } from './get-p-from-box.js';
const γγ3 = γγ(3);
const { sqrt } = Math;
/**
 * @internal
 * @param curve The curve
 * @param x The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
function getPotentialClosestPointsOnCurveCertified(curve, x, [tS, tE] = [0, 1], touchedCurve = undefined, t = undefined, for1Prong = false, angle = 0) {
    const ps = curve.ps;
    const shouldDeflate = angle === 0 && curve === touchedCurve;
    let { polyDd: polyDdO, polyE: polyEO, getPolyExact: getPolyExactO } = getFootPointsOnBezierPolysCertified(ps, x);
    const def = shouldDeflate
        ? ddDeflateWithRunningError(polyDdO, polyEO.map(e => e / γγ3), t)
        : undefined;
    const def2 = for1Prong && shouldDeflate
        ? ddDeflateWithRunningError(def.coeffs, def.errBound.map(e => e / γγ3), t)
        : undefined;
    const def3 = for1Prong && shouldDeflate
        ? ddDeflateWithRunningError(def2.coeffs, def2.errBound.map(e => e / γγ3), t)
        : undefined;
    const { polyDd, polyE, getPolyExact } = def3 !== undefined
        ? { polyDd: def3.coeffs, polyE: def3.errBound.map(e => e / γγ3), getPolyExact: () => eDeflate(eDeflate(eDeflate(getPolyExactO(), t), t), t) }
        : def !== undefined
            ? { polyDd: def.coeffs, polyE: def.errBound.map(e => e / γγ3), getPolyExact: () => eDeflate(getPolyExactO(), t) }
            : { polyDd: polyDdO, polyE: polyEO, getPolyExact: getPolyExactO };
    const ris = allRootsCertified(polyDd, tS, tE, polyE, getPolyExact);
    const dontPush0 = ((t === 1 && curve === touchedCurve.next) ||
        (t === 0 && curve === touchedCurve));
    const dontPush1 = ((t === 0 && curve === touchedCurve.prev) ||
        (t === 1 && curve === touchedCurve));
    if (tS === 0) {
        if (!dontPush0) {
            ris.push({ tS: 0, tE: 0, multiplicity: 1 });
        }
    }
    else if (tS === 1) {
        if (!dontPush1) {
            ris.push({ tS: 1, tE: 1, multiplicity: 1 });
        }
    }
    else {
        ris.push({ tS: tS, tE: tS, multiplicity: 1 });
    }
    if (tE === 0) {
        if (!dontPush0) {
            ris.push({ tS: 0, tE: 0, multiplicity: 1 });
        }
    }
    else if (tE === 1) {
        if (!dontPush1) {
            ris.push({ tS: 1, tE: 1, multiplicity: 1 });
        }
    }
    else {
        ris.push({ tS: tE, tE: tE, multiplicity: 1 });
    }
    const infos = ris
        .map(ri => {
        const { tS: ts, tE: te } = ri;
        if (te < tS || ts > tE) {
            return undefined;
        }
        const _t = (ts + te) / 2;
        const t = _t < 0 ? 0 : _t > 1 ? 1 : _t;
        const box = getIntervalBox(ps, [ts, te]);
        const p_ = getPFromBox(box);
        const dSquaredI = rootIntervalToDistanceSquaredInterval(box, x);
        const t_ = t === 0 ? 1 : t;
        const curve_ = t === 0 ? curve.prev : curve;
        return {
            curve: curve_,
            p: p_,
            t: t_,
            d: (sqrt(dSquaredI[0]) + sqrt(dSquaredI[1])) / 2,
            dSquaredI,
            box,
        };
    });
    const infos_ = infos.filter(info => info !== undefined);
    return infos_;
}
export { getPotentialClosestPointsOnCurveCertified };
//# sourceMappingURL=get-potential-closest-points-on-curve-certified.js.map