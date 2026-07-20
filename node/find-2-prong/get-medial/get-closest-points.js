import { lengthSquared } from "flo-vector2d";
import { roots, Horner } from 'flo-poly';
import { evalDeCasteljau, getMedialPointCoeffs, getMedialPointCoeffsBez0, getMedialPointCoeffsBez2_SameCurve, getMedialPointCoeffsBez3_SameCurve } from 'flo-bezier3';
const { sqrt, abs, max } = Math;
/**
 * @param maxCoordPowerOf2
 * @param nnorm
 * @param yPos The point on the shape
 * @param for1Prong defaults to `false`;
 * @param angle defaults to `0`;
 * @param curvePiece The curve piece
 *
 * @internal
 */
function getClosestPoint(maxCoordPowerOf2, nnorm, yPos, for1Prong, angle, curvePiece) {
    const { curve, ts: [tS, tE] } = curvePiece;
    const { ps } = curve;
    const { curve: touchedCurve, t, p: y } = yPos;
    const isTouched = curve === touchedCurve;
    const shouldDeflate = angle === 0 && isTouched;
    const infos = [];
    let startPushed = false;
    let endPushed = false;
    let ss;
    if (tS !== tE &&
        !(shouldDeflate && ps.length === 2) &&
        !(isTouched && ps.length === 3 && for1Prong)) {
        const { A, B, H } = shouldDeflate
            ? ps.length === 3
                ? getMedialPointCoeffsBez2_SameCurve(t, nnorm, ps)
                : getMedialPointCoeffsBez3_SameCurve(t, nnorm, ps)
            : getMedialPointCoeffs(y, nnorm, ps);
        ss = roots(H, tS, tE) || [];
        //-----------------------
        for (let i = 0; i < ss.length; i++) {
            const ri = ss[i];
            const { tS: sS, tE: sE, t: _s } = ri;
            if (ri.multiplicity > 1) {
                continue;
            }
            if (sE < tS || sS > tE) {
                continue;
            } // outside curve piece
            if (sS < 0) {
                continue;
            } // outside curve piece
            // clip to [0,1]
            const s = sE > 1 ? 1 : _s;
            //-----------------------
            const AS = Horner(A, s);
            const BS = Horner(B, s);
            // const CS = Horner(C, s);
            // const DS = Horner(D, s);
            const _AS = abs(AS);
            // const _CS = abs(CS);
            // if (max(_AS, _CS) < 2**-40) { continue; }
            if (max(_AS) < 2 ** -40) {
                continue;
            }
            // const w = _AS > _CS
            //     ? -BS / AS
            //     : -DS / CS;  // alternative
            const w = -BS / AS;
            if (w <= 0) {
                // If `w` is negative the circle radius is negative -> discard
                continue;
            }
            const V = [w * nnorm[0], w * nnorm[1]];
            const d = sqrt(lengthSquared(V));
            if (d <= 2 ** (maxCoordPowerOf2 - 40)) {
                // If `w` <= 2**-40 -> discard
                continue;
            }
            const x = [y[0] + V[0], y[1] + V[1]];
            //-----------------------
            if (ri.tS <= tS && ri.tE >= tS) {
                startPushed = true;
            }
            if (ri.tS <= tE && ri.tE >= tE) {
                endPushed = true;
            }
            // If the point is the first control point of the curve then we
            // ensure the point becomes the last control point of the prior
            // curve to induce some symmetery and simplify the algorithm.
            const s_ = s === 0 ? 1 : s;
            const curve_ = s === 0 ? curve.prev : curve;
            const info = {
                curve: curve_,
                s: s_,
                d, x
            };
            infos.push(info);
        }
    }
    //------------------------------------------
    const pLast = ps[ps.length - 1];
    let dontPush1 = ((t === 0 && curve === touchedCurve.prev) ||
        (t === 1 && curve === touchedCurve));
    //--------------------------------------
    // Also check curve start control point
    //--------------------------------------
    const PS = [];
    if (tS === 0) {
        // We never check points at `t === 0` since they are covered by the previous curve's endpoint
        // which cannot be culled if this curve`s `t === 0` is included
    }
    else if (tS === 1) {
        if (!dontPush1 && !startPushed) {
            PS.push({ P: pLast, t: 1 });
        }
    }
    else {
        if (!startPushed) {
            const pp = evalDeCasteljau(ps, tS);
            PS.push({ P: pp, t: tS });
        }
    }
    //--------------------------------------
    // Also check curve end control point
    //--------------------------------------
    if (tS !== tE) {
        if (tE === 0) {
            // We never check points at `t === 0` since they are covered by the previous curve's endpoint
            // which cannot be culled if this curve`s `t === 0` is included
        }
        else if (tE === 1) {
            if (!dontPush1 && !endPushed) {
                PS.push({ P: pLast, t: 1 });
                dontPush1 = true;
            }
        }
        else {
            if (!endPushed) {
                const pp = evalDeCasteljau(ps, tE);
                PS.push({ P: pp, t: tE });
            }
        }
    }
    //------------------------------------------
    for (let i = 0; i < PS.length; i++) {
        //-----------------------
        const { P, t: s } = PS[i];
        const { a0, b0 } = getMedialPointCoeffsBez0(y, nnorm, P);
        if (abs(a0) <= 2 ** -40 || abs(b0) <= 2 ** -40) {
            continue;
        }
        const w = -b0 / a0;
        // too close to point of origin *or* negative;
        if (w < 2 ** -40) {
            continue;
        }
        const V = [w * nnorm[0], w * nnorm[1]];
        const d = sqrt(lengthSquared(V));
        const x = [y[0] + V[0], y[1] + V[1]];
        const s_ = s === 0 ? 1 : s;
        const curve_ = s === 0 ? curve.prev : curve;
        const info = {
            curve: curve_,
            s: s_,
            d, x
        };
        infos.push(info);
    }
    return infos;
}
export { getClosestPoint };
//# sourceMappingURL=get-closest-points.js.map