import type { Curve } from "flo-boolean";
import { eDeflate, createRootExact, roots, deflate, Horner, RootInterval } from 'flo-poly';
import { evalDeCasteljau, getFootPointsOnBezierPolysCertified, getIntervalBox } from 'flo-bezier3';
import { fromTo as fromToVec, lengthSquared } from "flo-vector2d";
import { ddDeflateWithRunningError } from '../../closest-boundary-point/dd-deflate-with-running-error.js';
import { rootIntervalToDistanceSquaredInterval } from '../../closest-boundary-point/root-interval-to-distance-squared-interval.js';
import { getPFromBox } from '../../closest-boundary-point/get-p-from-box.js';
import { CurvePiece } from "../../mat/curve-piece.js";
import { getMedialPointCoeffs } from './get-medial-points/double/get-medial-point-coeffs.js';
import { PointOnShape } from "../../point-on-shape/point-on-shape.js";
import { getMedialPointCoeffsBez0 } from "./get-medial-points/double/get-medial-point-coeffs-bez0.js";
import type { MedialPointInfo } from './medial-point-info.js';

const { sqrt, abs, max } = Math;
// TODO - in flo-poly; if interval length is 0 then it goes into infinite loop -> add guard


/**
 * @internal
 * 
 * @param pow
 * @param nnorm
 * @param yPos The point on the shape
 * @param for1Prong defaults to `false`;
 * @param angle defaults to `0`;
 * @param curvePiece The curve piece
 */
function getClosestPoint(
        pow: number,
        nnorm: number[], 
        yPos: PointOnShape,
        for1Prong: boolean,
        angle: number,
        curvePiece: CurvePiece): MedialPointInfo[] | undefined {

    const { curve, ts: [tS,tE] } = curvePiece;
    const { ps } = curve;
    const { curve: touchedCurve, t, p } = yPos;

    const shouldDeflate = angle === 0 && curve === touchedCurve;

    const infos: MedialPointInfo[] = [];
    // let zeroPushed = false;
    let onePushed = false;

    if (tS !== tE) {
        const { A, B, C, D, H } = getMedialPointCoeffs(p, nnorm, ps);

        const def = shouldDeflate ? deflate(H, t!) : undefined;
        
        const def2 = for1Prong && shouldDeflate
            ? deflate(def!, t!)
            : undefined;

        const def3 = for1Prong && shouldDeflate
            ? deflate(def2!, t!)
            : undefined;
        
        const pDd = def3 ?? def ?? H;
        
        const ss = roots(pDd, tS, tE) || [];
        //-----------------------

        if (ss.length > 1) {
            if (closeTo(2**4)(ss[0].t, ss[1].t)) {
                // console.log(p);
                // console.log(ps);
                // console.log(ss);
                // console.log(pDd,tS,tE);
                // console.log(angle);
                // console.log(nnorm);
                // console.log(shouldDeflate);
                // getMedialPointCoeffs(p, nnorm, ps);
                // console.log('---');
            }
        }
        for (let i=0; i<ss.length; i++) {
            const ri = ss[i];
            const { tS: sS, tE: sE, t: _s } = ri;
            if (ri.multiplicity > 1) {
                // console.log(ri.multiplicity);
                continue;
            }

            if (sE < tS || sS > tE) { continue; }  // outside curve piece

            const s = _s < 0 ? 0 : _s > 1 ? 1 : _s;  // clip to [0,1]

            //-----------------------
            const AS = Horner(A, s);
            const BS = Horner(B, s);
            const CS = Horner(C, s);
            const DS = Horner(D, s);

            const _AS = abs(AS);
            const _CS = abs(CS);

            if (max(_AS, _CS) < 2**-40) { continue; }

            const t = _AS > _CS
                ? -BS / AS
                : -DS / CS;  // alternative

            // too close to point of origin
            // TODO - multiply by norm length and take max coordinate into account
            if (t <= 2**-40) { continue; }

            const V = [t*nnorm[0], t*nnorm[1]];
            const d = sqrt(lengthSquared(V));

            const q = [p[0] + V[0], p[1] + V[1]];
            //-----------------------

            // if (s === 0) { zeroPushed = true; }
            if (s === 1) { onePushed = true; }

            const s_ = s === 0 ? 1 : s;
            const curve_ = s === 0 ? curve.prev : curve;

            const info: MedialPointInfo = {
                curve: curve_,
                s: s_,
                d,
                x: q
            };

            infos.push(info);
        }
    }


    //------------------------------------------
    const pLast = ps[ps.length - 1];

    // const dontPush0 = (
    //     (t === 1 && curve === touchedCurve!.next) ||
    //     (t === 0 && curve === touchedCurve) || zeroPushed
    // );
    const dontPush1 = (
        (t === 0 && curve === touchedCurve!.prev) ||
        (t === 1 && curve === touchedCurve) ||
        onePushed
    );

    const PS: { P: number[], t: number }[] = [];
    if (tS === 0) {
        // if (!dontPush0) { PS.push({ P: ps[0], t: 0 }); }
    } else if (tS === 1) {
        if (!dontPush1) { PS.push({ P: pLast, t: 1 }); }
    } else {
        const pp = evalDeCasteljau(ps, tS);
        PS.push({ P: pp, t: tS });
    }

    if (tE === 0) {  // TODO - this should not happen?
        // if (!dontPush0 && tS !== 0) { PS.push({ P: ps[0], t: 0 }); }
    } else if (tE === 1) {
        if (!dontPush1 && tS !== 1) { PS.push({ P: pLast, t: 1 }); }
    } else {
        if (tE !== tS) {
            const pp = evalDeCasteljau(ps, tE);
            PS.push({ P: pp, t: tE });
        }
    }
    //------------------------------------------


    for (let i=0; i<PS.length; i++) {
        //-----------------------
        const { P, t: s } = PS[i];
        const { A, B } = getMedialPointCoeffsBez0(p,nnorm,[P]);

        const AS = A[0];
        const BS = B[0];

        if (abs(AS) <= 2**-40 || abs(BS) <= 2**-40) { continue; }

        const t = -BS / AS;

        // too close to point of origin
        if (t < 2**-40) { continue; }

        const V = [t*nnorm[0], t*nnorm[1]];
        const d = sqrt(lengthSquared(V));

        const q = [p[0] + V[0], p[1] + V[1]];

        const s_ = s === 0 ? 1 : s;
        const curve_ = s === 0 ? curve.prev : curve;

        const info: MedialPointInfo = {
            curve: curve_,
            s: s_,
            d,
            x: q
        };

        infos.push(info);
    }
    //------------------------------------------
    // if (infos.length > 2) {
    //     if (closeTo(2**14)(infos[0].d, infos[2].d)) {
    //         console.log(infos);
    //     }
    // }

    return infos;
}


export { getClosestPoint }



// const shouldDeflate = angle === 0 && curve === touchedCurve;

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




const { EPSILON: eps } = Number;
/**
 * @param ulpsOrEps If a number then 2\*\*1 means last bit, 2\*\*2 means last 2 bits, etc... 
 * else if an array containing a single number then 1 means 1 eps, 2 means 2 eps, etc...
 */
function closeTo(ulpsOrEps: number | number[]) {
    let isUlps = true;
    if (Array.isArray(ulpsOrEps)) {
        isUlps = false;
        ulpsOrEps = ulpsOrEps[0];
    }

    function check(
            expected: ObjOrArray<number>,
            actual: ObjOrArray<number>): boolean {

        if (typeof expected === 'number') {
            if (typeof actual !== 'number') { return false; }
            const actual_ = actual as number;
            if (expected === Infinity) { return actual_ === Infinity; }
            const error = abs((isUlps ? expected : 1)*(ulpsOrEps as number)*eps);
            
            return (
                (actual_ >= expected - error) && 
                (actual_ <= expected + error)
            );
        }

        if (Array.isArray(expected)) {
            if (!Array.isArray(actual)) { return false; }
            if (expected.length !== actual.length) { return false; }

            for (let i=0; i<expected.length; i++) {
                const e = expected[i];
                const a = actual[i];
    
                if (!check(e,a)) { return false; }
            }

            return true;
        }
        
        if (typeof expected === 'object') {
            if (typeof actual !== 'object') { return false; }
            const actual_ = actual as { [key: string]: ObjOrArray<number> };
            const keys = Object.keys(expected);
            const keysE = Object.keys(actual_);
            if (keys.length !== keysE.length) { return false; }
            for (let key of keys) {
                const e = expected[key];
                const a = actual_[key];

                if (!check(e,a)) { return false; }
            }

            return true;
        }

        return false;  // unsupported types
    }

    return check;
}
type ObjOrArray<T> = 
    | T
    | ObjOrArray<T>[]
    | { [key:string]: ObjOrArray<T> };