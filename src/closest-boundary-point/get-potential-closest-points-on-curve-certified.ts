import type { Curve } from "flo-boolean";
import type { FootAndEndpointInfo } from './foot-and-endpoint-info.js';
import { roots } from 'flo-poly';
import { evalDeCasteljauDd, getFootPointsOnBezierPolysCertified, getIntervalBox } from 'flo-bezier3';
import { rootIntervalToDistanceSquaredInterval } from './root-interval-to-distance-squared-interval.js';
import { squaredDistanceBetweenDd } from "../find-2-prong/squared-distance-between-dd.js";
import { eps } from '../error-analysis/gamma.js';


/**
 * @internal
 * 
 * @param curve the curve
 * @param x the point from which to check
 * @param tRange The allowed t range
 */
function getPotentialClosestPointsOnCurveCertified(
        curve: Curve, 
        x: number[], 
        tRange: [number, number]): FootAndEndpointInfo[] {

    const [tS,tE] = tRange;
    const { ps } = curve;

    const infos: FootAndEndpointInfo[] = [];

    if (tS !== tE) {
        const { polyDd: pDd, polyE: pDd_, getPolyExact } =
            getFootPointsOnBezierPolysCertified(ps, x);

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
            }
        }));
    }

    const ts = tRange.slice();
    if (tS === tE) {
        ts.push(tS);
    }
    
    infos.push(...ts.map(t => {
        const p = evalDeCasteljauDd(ps, [0,t]).map(v => v[0] + v[1]);

        const d = squaredDistanceBetweenDd(p, x);

        const dSquaredI = [d*(1 - eps), d*(1 + eps)];

        const t_ = t === 0 ? 1 : t;
        const curve_ = t === 0 ? curve.prev : curve;

        return {
            curve: curve_,
            t: t_,
            dSquaredI
        }
    }));

    return infos;
}


export { getPotentialClosestPointsOnCurveCertified }
