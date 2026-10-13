import { expect, test } from '@jest/globals';
import { calcSquaredSeperationTolerance } from '../../src/find-2-prong/calc-seperation-tolerance.js';


/**
 * Reference: the squared chord `(2r·sin(θ/2))²` with `θ` from the law of
 * cosines formulation, computed via `1 - cos θ` to avoid cancellation.
 */
function refSquaredChord(R: number, r: number, δ: number) {
    const oneMinusCos = (R*δ + δ*δ/2) / ((R - r)*(r + δ));
    const θ = 2*Math.asin(Math.sqrt(oneMinusCos/2));
    return (2*r*Math.sin(θ/2))**2;
}


test('calcSquaredSeperationTolerance', function() {
    // a spread of osculating radii, MAT radii and (tiny) distance tolerances
    const cases: [number, number, number][] = [
        [100, 50, 2**-34], [100, 99, 2**-34], [1000, 0.5, 2**-30],
        [100, 99.999, 2**-34], [37.3, 12.1, 2**-40], [2**20, 1000, 2**-24],
    ];
    for (const [R, r, δ] of cases) {
        const d2 = calcSquaredSeperationTolerance(R, r, δ);
        expect(Number.isFinite(d2)).toBe(true);
        expect(d2).toBeGreaterThan(0);
        // agrees with the trigonometric reference
        expect(d2 / refSquaredChord(R, r, δ)).toBeCloseTo(1, 12);
    }

    // the closer the MAT radius gets to the osculating radius (a near
    // 1-prong) the larger the separation required
    const grow = [10, 50, 90, 99, 99.9].map(r => calcSquaredSeperationTolerance(100, r, 2**-34));
    for (let i=1; i<grow.length; i++) { expect(grow[i]).toBeGreaterThan(grow[i-1]); }

    // ...and a larger error tolerance requires more separation too
    expect(calcSquaredSeperationTolerance(100, 50, 2**-30))
        .toBeGreaterThan(calcSquaredSeperationTolerance(100, 50, 2**-34));

    // the enlarged MAT circle reaching the osculating circle: reject everything
    expect(calcSquaredSeperationTolerance(100, 100, 2**-34)).toBe(Infinity);
    expect(calcSquaredSeperationTolerance(100, 100 - 2**-40, 2**-34)).toBe(Infinity);
    expect(calcSquaredSeperationTolerance(100, 120, 2**-34)).toBe(Infinity);

    // sanity: a concrete value (R=100, r=50, δ=2**-34), chord ~ 1.079e-4
    expect(Math.sqrt(calcSquaredSeperationTolerance(100, 50, 2**-34))).toBeCloseTo(1.078959e-4, 9);
});
