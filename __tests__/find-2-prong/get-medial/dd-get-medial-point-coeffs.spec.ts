import { expect, test } from '@jest/globals';
import { getMedialPointCoeffs } from 'flo-bezier3';
import { ddGetMedialPointCoeffs } from '../../../src/get-medial-points/double-double/dd-get-medial-point-coeffs.js';
import { squares } from 'squares-rng';

const { floor, abs } = Math;


function toDdVec(v: number[]): number[][] {
    return v.map(x => [0, x]);
}

function ddPolyToDouble(poly: number[][]): number[] {
    return poly.map(c => c[1]);
}


function randomNumberIn01(seed: number): number {
    return squares(seed) * 2**-32;
}

function randomSignedValue(seed: number): number {
    const sign = randomNumberIn01(seed) < 0.5 ? -1 : 1;
    const exponent = floor(randomNumberIn01(seed + 1) * 81) - 40;
    const mantissa = 1 + randomNumberIn01(seed + 2);

    return sign * mantissa * 2**exponent;
}

function randomPoint(seed: number): number[] {
    return [
        randomSignedValue(seed),
        randomSignedValue(seed + 1009)
    ];
}


test('ddGetMedialPointCoeffs matches flo-bezier3 double coefficients', function() {
    const ulps = 2**12;

    const cases: { p: number[]; v: number[]; ps: number[][] }[] = [];
    const casesPerOrder = 24;
    let seed = 123456789;

    for (let controlPointCount = 1; controlPointCount <= 4; controlPointCount++) {
        for (let i = 0; i < casesPerOrder; i++) {
            const p = randomPoint(seed); seed += 11;
            let v = randomPoint(seed); seed += 11;

            // Keep the direction away from near-zero vectors.
            if (abs(v[0]) + abs(v[1]) < 2**-20) {
                v = [v[0] + 1, v[1] - 1];
            }

            const ps: number[][] = [];
            for (let j = 0; j < controlPointCount; j++) {
                ps.push(randomPoint(seed));
                seed += 13;
            }

            cases.push({ p, v, ps });
        }
    }

    for (const { p, v, ps } of cases) {
        const coeffs = getMedialPointCoeffs(p, v, ps);
        const ddCoeffs = ddGetMedialPointCoeffs(toDdVec(p), toDdVec(v), ps);

        expect(coeffs.A).toBeNearly(ulps, ddPolyToDouble(ddCoeffs.A));
        expect(coeffs.B).toBeNearly(ulps, ddPolyToDouble(ddCoeffs.B));
        expect(coeffs.C).toBeNearly(ulps, ddPolyToDouble(ddCoeffs.C));
        expect(coeffs.D).toBeNearly(ulps, ddPolyToDouble(ddCoeffs.D));
        expect(coeffs.H).toBeNearly(ulps, ddPolyToDouble(ddCoeffs.H));
    }
});
