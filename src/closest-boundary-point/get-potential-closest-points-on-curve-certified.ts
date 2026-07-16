import type { Curve } from "flo-boolean";
import type { FootAndEndpointInfo } from './foot-and-endpoint-info.js';
import { createRootExact, roots } from 'flo-poly';
import { getFootPointsOnBezierPolysCertified, getIntervalBox } from 'flo-bezier3';
import { rootIntervalToDistanceSquaredInterval } from './root-interval-to-distance-squared-interval.js';
import { getPFromBox } from './get-p-from-box.js';

const { sqrt } = Math;


/**
 * @internal
 * 
 * @param maxCoordPowerOf2
 * @param curve the curve
 * @param x the point from which to check
 * @param tRange The allowed t range
 */
function getPotentialClosestPointsOnCurveCertified(
        maxCoordPowerOf2: number,
        curve: Curve, 
        x: number[], 
        tRange: [number, number]): FootAndEndpointInfo[] {

    const [tS,tE] = tRange;
    const ps = curve.ps;

    let { polyDd: pDd, polyE: pDd_, getPolyExact } =
        getFootPointsOnBezierPolysCertified(ps, x);

    const ris = roots(pDd, tS, tE, pDd_, getPolyExact) || [];

    ris.push(createRootExact(tS));
    ris.push(createRootExact(tE));

    const infos = ris
    .map(ri => {
        const { tS: ts, tE: te } = ri;

        const _t = (ts + te)/2;
        const t = _t < 0 ? 0 : _t > 1 ? 1 : _t;

        const box = getIntervalBox(ps, [ts, te]);
        const p_ = getPFromBox(box);
        
        const dSquaredI = rootIntervalToDistanceSquaredInterval(maxCoordPowerOf2, box, x);

        const t_ = t === 0 ? 1 : t;
        const curve_ = t === 0 ? curve.prev : curve;

        return {
            curve: curve_,
            p: p_,
            t: t_,
            d: (sqrt(dSquaredI[0]) + sqrt(dSquaredI[1]))/2,
            dSquaredI,
            box
        }
    });

    return infos;
}


export { getPotentialClosestPointsOnCurveCertified }
