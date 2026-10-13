import { roots } from 'flo-poly';
import { getFootPointsOnBezierPolysCertified, getIntervalBox } from 'flo-bezier3';
import { rootIntervalToDistanceSquaredInterval } from './root-interval-to-distance-squared-interval.js';
import { getEndpointInfoCertified } from './get-endpoint-info.js';
/**
 * @internal
 *
 * @param curve the curve
 * @param x the point from which to check
 * @param tRange The allowed t range
 */
function getPotentialClosestPointsOnCurveCertified(curve, x, tRange) {
    const [tS, tE] = tRange;
    const { ps } = curve;
    const infos = [];
    if (tS !== tE) {
        const { polyDd: pDd, polyE: pDd_, getPolyExact } = getFootPointsOnBezierPolysCertified(ps, x);
        const ris = roots(pDd, tS, tE, pDd_, getPolyExact) || [];
        infos.push(...ris.map(ri => {
            const { tS: ts, tE: te, t: _t } = ri;
            const t = _t < 0 ? 0 : _t > 1 ? 1 : _t;
            const box = getIntervalBox(ps, [ts, te]);
            const dSquaredI = rootIntervalToDistanceSquaredInterval(box, x);
            const t_ = t === 0 ? 1 : t;
            const curve_ = t === 0 ? curve.prev : curve;
            return {
                curve: curve_,
                t: t_,
                dSquaredI
            };
        }));
    }
    // the endpoints of the range (just the one if the range is a single point)
    const ts = tS === tE ? [tS] : [tS, tE];
    infos.push(...ts.map(t => getEndpointInfoCertified(curve, x, t)));
    return infos;
}
export { getPotentialClosestPointsOnCurveCertified };
//# sourceMappingURL=get-potential-closest-points-on-curve-certified.js.map