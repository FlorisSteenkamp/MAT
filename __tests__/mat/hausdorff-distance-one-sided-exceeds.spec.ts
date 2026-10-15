import { describe, expect, test } from '@jest/globals';
import { hausdorffDistanceOneSided, closestPointOnBezier, evalDeCasteljau } from 'flo-bezier3';
import { hausdorffDistanceOneSidedExceeds, distanceToCurves } from '../../src/mat/hausdorff-distance-one-sided-exceeds.js';


/**
 * The one-sided Hausdorff distance from `A` to the piecewise curve `B`
 * approximated by dense sampling of `A` (a lower bound, accurate to within
 * the sample spacing times the speed of `A`).
 */
function sampledHausdorffDistanceOneSided(
        A: number[][],
        B: number[][][],
        samples = 4096): number {

    let worst = 0;
    for (let i=0; i<=samples; i++) {
        const p = evalDeCasteljau(A, i/samples);
        let best = Infinity;
        for (const qs of B) {
            best = Math.min(best, closestPointOnBezier(qs, p).d);
        }
        worst = Math.max(worst, best);
    }

    return worst;
}


// a handful of 'from' curves of all orders
const As: number[][][] = [
    [[0,0], [100,0]],                           // a line
    [[0,0], [50,30], [100,0]],                  // a quadratic
    [[0,0], [30,40], [70,-40], [100,0]],        // a cubic with an inflection
    [[0,0], [10,80], [90,80], [100,0]],         // a 'tall' cubic
    [[0,0], [100,0], [0,0]],                    // a degenerate (folded) quadratic
];

// a handful of 'to' curves
const Bs: number[][][] = [
    [[0,1], [100,1]],                           // a line (offset by 1)
    [[0,0], [50,10], [100,0]],                  // a quadratic
    [[0,0], [50,-10], [100,0]],                 // a quadratic bending the other way
    [[-10,5], [40,60], [110,-20]],              // a quadratic not sharing endpoints
    [[0,0], [30,10], [70,10], [100,0]],         // a cubic
];

// relative margin beyond which the answers must certainly agree
const MARGIN = 2**-10;


describe('hausdorffDistanceOneSidedExceeds', function() {
    test('agrees with the computed one-sided Hausdorff distance (single curve B)', function() {
        let checks = 0;
        for (const A of As) {
            for (const B of Bs) {
                // a very accurate reference value
                const hd = hausdorffDistanceOneSided(A, B, 2**-30, 10_000);
                expect(hd).toBeGreaterThan(0);

                // tolerances on both sides of the reference value, with the
                // band `[tolerance - margin, tolerance]` (in which the answer
                // may conservatively be `true`) never containing it (e.g. the
                // folded quadratic is at a uniform distance of 1 from the
                // first line)
                for (const f of [1/4, 1/2, 1 - 2*MARGIN, 1 + 2*MARGIN, 2, 4]) {
                    const tolerance = f*hd;
                    const exceeds = hausdorffDistanceOneSidedExceeds(A, [B], tolerance, MARGIN*hd);
                    expect(exceeds).toBe(hd > tolerance);
                    checks++;
                }
            }
        }
        expect(checks).toBe(As.length*Bs.length*6);
    });

    test('agrees with a densely sampled one-sided Hausdorff distance (piecewise B)', function() {
        // piecewise 'to' curves - two quads joined at a point, and two
        // disconnected pieces
        const Bss: number[][][][] = [
            [[[0,0], [25,20], [50,10]], [[50,10], [75,0], [100,0]]],
            [[[0,2], [40,2]], [[60,-2], [100,-2]]],
            [[[0,0], [30,10], [50,0]], [[50,0], [70,-10], [100,0]]],
        ];

        for (const A of As) {
            for (const Bs of Bss) {
                const hd = sampledHausdorffDistanceOneSided(A, Bs);
                expect(hd).toBeGreaterThan(0);

                // the sampled value is a lower bound accurate to about
                // `speed/4096` which is ~0.05 here, so stay well clear of it
                expect(hausdorffDistanceOneSidedExceeds(A, Bs, hd*(1 - 2**-3), MARGIN*hd)).toBe(true);
                expect(hausdorffDistanceOneSidedExceeds(A, Bs, hd*(1 + 2**-3), MARGIN*hd)).toBe(false);
            }
        }
    });

    test('decides trivially for a point or line to a line', function() {
        const B = [[[0,1], [100,1]]];
        expect(hausdorffDistanceOneSidedExceeds([[50,0]], B, 0.5, 2**-20)).toBe(true);
        expect(hausdorffDistanceOneSidedExceeds([[50,0]], B, 1.5, 2**-20)).toBe(false);
        expect(hausdorffDistanceOneSidedExceeds([[0,0], [100,0]], B, 0.5, 2**-20)).toBe(true);
        expect(hausdorffDistanceOneSidedExceeds([[0,0], [100,0]], B, 1.5, 2**-20)).toBe(false);
        // a line to a line not parallel to it - the max is at an endpoint
        expect(hausdorffDistanceOneSidedExceeds([[0,0], [100,0]], [[[0,0], [100,10]]], 9.9, 2**-20)).toBe(true);
        expect(hausdorffDistanceOneSidedExceeds([[0,0], [100,0]], [[[0,0], [100,10]]], 10.1, 2**-20)).toBe(false);
    });

    test('is conservative within the margin', function() {
        // the endpoints of `A` lie on `B` and the middle (`t = 1/2`, the
        // first point tried) is 10 away, which is the distance
        const A = [[0,0], [50,20], [100,0]];
        const B = [[[0,0], [100,0]]];
        // decides correctly outside the margin
        expect(hausdorffDistanceOneSidedExceeds(A, B, 10.5, 0.1)).toBe(false);
        expect(hausdorffDistanceOneSidedExceeds(A, B, 9.9, 0.1)).toBe(true);
        // the distance (10) is within the margin below the tolerance (10.2)
        // so the check may stop as soon as it finds it (the upper bound
        // then still being well above the tolerance) and fail conservatively
        expect(hausdorffDistanceOneSidedExceeds(A, B, 10.2, 1)).toBe(true);
    });

    test('accepts a curve only just within tolerance (given a small margin)', function() {
        // a case from simplifying a glyph's MAT that the previous iteration
        // limited version (1000 bisections) failed conservatively: the
        // distance is ~0.12345
        const A = [[199.92633401418215,339.1925881622451],[227.00454513420547,344.68770359828403],[253.738391585154,339.5929808754821]];
        const B = [[[199.92633401418215,339.1925881622451],[240.45719229000727,347.41771588431595],[277.7519825791059,332.617403229154]]];
        expect(hausdorffDistanceOneSidedExceeds(A, B, 0.125, 2**-13)).toBe(false);
        expect(hausdorffDistanceOneSidedExceeds(A, B, 0.123, 2**-13)).toBe(true);
    });

    test('distanceToCurves is the minimum over the pieces', function() {
        const Bs = [[[0,0], [100,0]], [[0,10], [100,10]]];
        expect(distanceToCurves([50,2], Bs)).toBeCloseTo(2, 12);
        expect(distanceToCurves([50,8], Bs)).toBeCloseTo(2, 12);
        expect(distanceToCurves([150,0], Bs)).toBeCloseTo(50, 12);
    });
});
