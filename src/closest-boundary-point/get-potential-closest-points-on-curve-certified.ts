import type { Curve } from "flo-boolean";
import type { FootAndEndpointInfo } from './foot-and-endpoint-info.js';
import { createRootExact, roots } from 'flo-poly';
import { eDeflate } from 'flo-poly';
import { getFootPointsOnBezierPolysCertified, getIntervalBox } from 'flo-bezier3';
import { ddDeflateWithRunningError } from './dd-deflate-with-running-error.js';
// import { γγ } from '../error-analysis/gamma.js';
import { rootIntervalToDistanceSquaredInterval } from './root-interval-to-distance-squared-interval.js';
import { getPFromBox } from './get-p-from-box.js';


// const γγ3 = γγ(3);

const { sqrt } = Math;


/**
 * @internal
 * 
 * @param pow
 * @param curve The curve
 * @param x The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 * @param for1Prong defaults to `false;
 * @param angle defaults to `0`;
 */
function getPotentialClosestPointsOnCurveCertified(
        maxCoordPowerOf2: number,
        curve: Curve, 
        x: number[], 
        tRange: number[] = [0,1], 
        touchedCurve: Curve | undefined = undefined,
        t: number | undefined = undefined,
        for1Prong = false,
        angle = 0): FootAndEndpointInfo[] {

    const [tS,tE] = tRange;
    const ps = curve.ps;

    const shouldDeflate = angle === 0 && curve === touchedCurve;

    let { polyDd: polyDdO, polyE: polyEO, getPolyExact: getPolyExactO } =
        getFootPointsOnBezierPolysCertified(ps, x);

    const def = shouldDeflate
            ? ddDeflateWithRunningError(polyDdO, polyEO, t!)
            : undefined;
    
    const def2 = for1Prong && shouldDeflate
            ? ddDeflateWithRunningError(def!.coeffs, def!.errBound, t!)
            : undefined;

    const def3 = for1Prong && shouldDeflate
            ? ddDeflateWithRunningError(def2!.coeffs, def2!.errBound, t!)
            : undefined;
    
    const { pDd, pDd_, getPolyExact } = 
              def3 !== undefined
            ? {
                pDd: def3.coeffs,
                pDd_: def3.errBound,
                getPolyExact: () => eDeflate(eDeflate(eDeflate(getPolyExactO(), t!), t!), t!)
            }
            : def !== undefined
            ? {
                pDd: def.coeffs,
                pDd_: def.errBound,
                getPolyExact: () => eDeflate(getPolyExactO(), t!)
            }
            : {
                pDd: polyDdO,
                pDd_: polyEO,
                getPolyExact: getPolyExactO
            };
    
    const ris = roots(pDd, tS, tE, pDd_, getPolyExact) || [];

    const dontPush0 = (
        (t === 1 && curve === touchedCurve!.next) ||
        (t === 0 && curve === touchedCurve)
    );
    const dontPush1 = (
        (t === 0 && curve === touchedCurve!.prev) ||
        (t === 1 && curve === touchedCurve)
    );

    if (tS === 0) {
        if (!dontPush0) { ris.push(createRootExact(0)); }
    } else if (tS === 1) {
        if (!dontPush1) { ris.push(createRootExact(1)); }
    } else {
        ris.push(createRootExact(tS));
    }

    if (tE === 0) {
        if (!dontPush0) { ris.push(createRootExact(0)); }
    } else if (tE === 1) {
        if (!dontPush1) { ris.push(createRootExact(1)); }
    } else {
        ris.push(createRootExact(tE));
    }

    const infos = ris
    .map(ri => {
        const { tS: ts, tE: te } = ri;

        if (te < tS || ts > tE) {
            return undefined;
        }

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
            box,
        }
    });

    const infos_ = infos.filter(info => info !== undefined) as FootAndEndpointInfo[];

    return infos_;
}


export { getPotentialClosestPointsOnCurveCertified }
