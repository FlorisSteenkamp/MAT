import { expect, test } from '@jest/globals';
import { squares } from 'squares-rng';
import { getMedialPointCoeffsBez2_SameCurve, getMedialPointCoeffsBez3_SameCurve } from 'flo-bezier3';
import { ddGetMedialPointCoeffsBez2_SameCurve } from '../../../src/get-medial-points/double-double/dd-get-medial-point-coeffs-bez2-same-curve.js';
import { ddGetMedialPointCoeffsBez3_SameCurve } from '../../../src/get-medial-points/double-double/dd-get-medial-point-coeffs-bez3-same-curve.js';
import { ddNormal } from 'flo-bezier3';


function toDdVec(v: number[]): number[][] {
    return v.map(x => [0, x]);
}

function ddPolyToDouble(poly: number[][]): number[] {
    return poly.map(c => c[0] + c[1]);
}

function normalizedPoly(poly: number[]): number[] {
    let m = 0;
    for (const x of poly) {
        const ax = Math.abs(x);
        if (ax > m) { m = ax; }
    }

    if (m === 0) {
        return poly.slice();
    }

    return poly.map(x => x / m);
}

function randomNumberIn01(seed: number): number {
    return squares(seed) * 2**-32;
}

function randomSignedValue(seed: number): number {
    const sign = randomNumberIn01(seed) < 0.5 ? -1 : 1;
    const exponent = Math.floor(randomNumberIn01(seed + 1) * 61) - 30;
    const mantissa = 1 + Math.floor(randomNumberIn01(seed + 2) * 2**20);

    return sign * mantissa * 2**exponent;
}

function randomPoint(seed: number): number[] {
    return [
        randomSignedValue(seed),
        randomSignedValue(seed + 1009)
    ];
}


test('dd same-curve coefficients match flo-bezier3 double coefficients', function() {
    const epsMain = [2**16];
    const epsD = [2**8];
    const epsH = [2**13];
    const casesPerOrder = 32;
    let seed = 246813579;

    for (let i = 0; i < casesPerOrder; i++) {
        const t = 0.01 + 0.98 * randomNumberIn01(seed); seed += 7;

        const ps2 = [
            randomPoint(seed),
            randomPoint(seed + 13),
            randomPoint(seed + 29)
        ];
        seed += 43;

        const n2Dd = ddNormal(ps2, t);
        let v2 = [n2Dd[0][1], n2Dd[1][1]];
        if (Math.abs(v2[0]) + Math.abs(v2[1]) < 2**-20) {
            v2 = [v2[0] + 1, v2[1] - 1];
        }
        const v2Dd = toDdVec(v2);

        const coeffs2 = getMedialPointCoeffsBez2_SameCurve(t, v2, ps2);
        const ddCoeffs2 = ddGetMedialPointCoeffsBez2_SameCurve(t, v2Dd, ps2);

        expect(normalizedPoly(coeffs2.A)).toBeNearly(epsMain, normalizedPoly(ddPolyToDouble(ddCoeffs2.A)));
        expect(normalizedPoly(coeffs2.B)).toBeNearly(epsMain, normalizedPoly(ddPolyToDouble(ddCoeffs2.B)));
        expect(normalizedPoly(coeffs2.H)).toBeNearly(epsH, normalizedPoly(ddPolyToDouble(ddCoeffs2.H)));

        const ps3 = [
            randomPoint(seed),
            randomPoint(seed + 17),
            randomPoint(seed + 31),
            randomPoint(seed + 47)
        ];
        seed += 59;

        const n3Dd = ddNormal(ps3, t);
        let v3 = [n3Dd[0][1], n3Dd[1][1]];
        if (Math.abs(v3[0]) + Math.abs(v3[1]) < 2**-20) {
            v3 = [v3[0] + 1, v3[1] - 1];
        }
        const v3Dd = toDdVec(v3);

        const coeffs3 = getMedialPointCoeffsBez3_SameCurve(t, v3, ps3);
        const ddCoeffs3 = ddGetMedialPointCoeffsBez3_SameCurve(t, v3Dd, ps3);

        expect(normalizedPoly(coeffs3.A)).toBeNearly(epsMain, normalizedPoly(ddPolyToDouble(ddCoeffs3.A)));
        expect(normalizedPoly(coeffs3.B)).toBeNearly(epsMain, normalizedPoly(ddPolyToDouble(ddCoeffs3.B)));
        expect(normalizedPoly(coeffs3.C)).toBeNearly(epsMain, normalizedPoly(ddPolyToDouble(ddCoeffs3.C)));
        expect(normalizedPoly(coeffs3.D)).toBeNearly(epsD, normalizedPoly(ddPolyToDouble(ddCoeffs3.D)));
        expect(normalizedPoly(coeffs3.H)).toBeNearly(epsH, normalizedPoly(ddPolyToDouble(ddCoeffs3.H)));
    }
});
