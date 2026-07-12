import { createRootExact, roots, deflate } from 'flo-poly';
import { getIntervalBox } from 'flo-bezier3';
import { fromTo as fromToVec } from "flo-vector2d";
import { rootIntervalToDistanceSquaredInterval } from '../../closest-boundary-point/root-interval-to-distance-squared-interval.js';
import { getPFromBox } from '../../closest-boundary-point/get-p-from-box.js';
import { getMedialPointCoeffs } from './get-medial-points/get-medial-point-coeffs.js';
const { sqrt } = Math;
/**
 * @internal
 *
 * @param pow
 * @param curvePiece The curve piece
 * @param x The point from which to check
 * @param yPos The point on the shape
 * @param for1Prong defaults to `false`;
 * @param angle defaults to `0`;
 */
function getClosestPoint(pow, curvePiece, x, 
// touchedCurve: Curve | undefined = undefined,
// t: number | undefined = undefined,
yPos, for1Prong = false, angle = 0) {
    const { curve, ts: [tS, tE] } = curvePiece;
    const { ps } = curve;
    const { curve: touchedCurve, t, p } = yPos;
    const shouldDeflate = angle === 0 && curve === touchedCurve;
    // let { polyDd: polyDdO, polyE: polyEO, getPolyExact: getPolyExactO } =
    //     getFootPointsOnBezierPolysCertified(ps, x);
    // const def = shouldDeflate
    //         ? ddDeflateWithRunningError(polyDdO, polyEO, t!)
    //         : undefined;
    // const def2 = for1Prong && shouldDeflate
    //         ? ddDeflateWithRunningError(def!.coeffs, def!.errBound, t!)
    //         : undefined;
    // const def3 = for1Prong && shouldDeflate
    //         ? ddDeflateWithRunningError(def2!.coeffs, def2!.errBound, t!)
    //         : undefined;
    // const { pDd, pDd_, getPolyExact } = 
    //           def3 !== undefined
    //         ? {
    //             pDd: def3.coeffs,
    //             pDd_: def3.errBound,
    //             getPolyExact: () => eDeflate(eDeflate(eDeflate(getPolyExactO(), t!), t!), t!)
    //         }
    //         : def !== undefined
    //         ? {
    //             pDd: def.coeffs,
    //             pDd_: def.errBound,
    //             getPolyExact: () => eDeflate(getPolyExactO(), t!)
    //         }
    //         : {
    //             pDd: polyDdO,
    //             pDd_: polyEO,
    //             getPolyExact: getPolyExactO
    //         };
    // const ris = roots(pDd, tS, tE, pDd_, getPolyExact) || [];
    //-----------------------
    // let { polyDd: polyDdO, polyE: polyEO, getPolyExact: getPolyExactO } =
    //     getFootPointsOnBezierPolysCertified(ps, x);
    const v = fromToVec(p, x);
    const { A, B, C, D, H } = getMedialPointCoeffs(x, v, ps);
    const def = shouldDeflate
        ? deflate(H, t)
        : undefined;
    const def2 = for1Prong && shouldDeflate
        ? deflate(def, t)
        : undefined;
    const def3 = for1Prong && shouldDeflate
        ? deflate(def2, t)
        : undefined;
    const { pDd } = def3 !== undefined
        ? {
            pDd: def3,
        }
        : def !== undefined
            ? {
                pDd: def,
            }
            : {
                pDd: H,
            };
    const ris = roots(pDd, tS, tE) || [];
    //-----------------------
    const dontPush0 = ((t === 1 && curve === touchedCurve.next) ||
        (t === 0 && curve === touchedCurve));
    const dontPush1 = ((t === 0 && curve === touchedCurve.prev) ||
        (t === 1 && curve === touchedCurve));
    if (tS === 0) {
        if (!dontPush0) {
            ris.push(createRootExact(0));
        }
    }
    else if (tS === 1) {
        if (!dontPush1) {
            ris.push(createRootExact(1));
        }
    }
    else {
        ris.push(createRootExact(tS));
    }
    if (tE === 0) {
        if (!dontPush0) {
            ris.push(createRootExact(0));
        }
    }
    else if (tE === 1) {
        if (!dontPush1) {
            ris.push(createRootExact(1));
        }
    }
    else {
        ris.push(createRootExact(tE));
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
        const dSquaredI = rootIntervalToDistanceSquaredInterval(pow, box, x);
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
export { getClosestPoint };
//# sourceMappingURL=get-closest-points.js.map