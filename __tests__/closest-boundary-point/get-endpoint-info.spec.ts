import { expect, test } from '@jest/globals';
import type { Curve } from 'flo-boolean';
import type { FootAndEndpointInfo } from '../../src/closest-boundary-point/foot-and-endpoint-info.js';
import { evalDeCasteljauDd } from 'flo-bezier3';
import { ddDiffDouble, ddMultDd, ddAddDd, ddLt, ddGt, ddToStr } from 'double-double';
import { getEndpointInfoCertified } from '../../src/closest-boundary-point/get-endpoint-info.js';
import { squaredDistanceBetweenDd } from '../../src/find-2-prong/squared-distance-between-dd.js';
import { eps } from '../../src/error-analysis/gamma.js';


/**
 * The *previous* (library) implementation, kept here for comparison only: the
 * point is rounded to double precision *before* the distance is taken, which
 * introduces an absolute error of about `|p|·eps/2` per coordinate; the
 * returned interval only accounts for a *relative* error of `eps` in the
 * squared distance and is thus too narrow whenever the point is closer to `x`
 * than to the origin.
 */
function getEndpointInfoUncertified(
        curve: Curve,
        x: number[],
        t: number): FootAndEndpointInfo {

    const { ps } = curve;

    const p = evalDeCasteljauDd(ps, [0,t]).map(v => v[0] + v[1]);
    const d = squaredDistanceBetweenDd(p, x);
    const dSquaredI = [d*(1 - eps), d*(1 + eps)];

    const t_ = t === 0 ? 1 : t;
    const curve_ = t === 0 ? curve.prev : curve;

    return { curve: curve_, t: t_, dSquaredI };
}


/**
 * The squared distance from `x` to the point at `t` on `ps` in double-double
 * precision (accurate to roughly 30 significant digits): the reference value.
 */
function squaredDistanceDd(ps: number[][], t: number, x: number[]): number[] {
    const pDd = evalDeCasteljauDd(ps, [0,t]);
    const dx = ddDiffDouble(pDd[0], x[0]);
    const dy = ddDiffDouble(pDd[1], x[1]);
    return ddAddDd(ddMultDd(dx,dx), ddMultDd(dy,dy));
}

const contains = (I: number[], dRef: number[]) => !ddLt(dRef, [0,I[0]]) && !ddGt(dRef, [0,I[1]]);


test('getEndpointInfoCertified vs the old implementation - point far from the origin, close to x', function() {
    // A cubic with a chord of about 1000 units, living around coordinate
    // 1000..2000 (as e.g. glyph outlines do); the point at `t` is about
    // 1300 from the origin but less than 1 unit from `x`.
    const ps = [[1000,0],[1300,0],[1700,0],[2000,0]];
    const t = 0.3;
    const curve = { ps } as Curve;
    const p = evalDeCasteljauDd(ps, [0,t]).map(v => v[0] + v[1]);
    const x = [Math.floor(p[0]), 0];  // on the line, just before the point
    expect(p[0] - x[0]).toBeGreaterThan(0.1);
    expect(p[0] - x[0]).toBeLessThan(1);

    // The reference squared distance to ~30 digits. The error from rounding
    // the point to double is about |p|*eps/2 ~ 1300 * 1.1e-16 ~ 1.4e-13 in
    // the coordinate, i.e. ~3e-13 in the squared distance - roughly a
    // thousand times the `eps` relative error the old interval claims.
    const dRef = squaredDistanceDd(ps, t, x);

    const oldI = getEndpointInfoUncertified(curve, x, t).dSquaredI;
    const newI = getEndpointInfoCertified(curve, x, t).dSquaredI;

    console.log(
        `reference d²  = ${ddToStr(dRef)}\n` +
        `old interval  = [${oldI[0]}, ${oldI[1]}]  width/d = ${(oldI[1]-oldI[0])/oldI[0]}\n` +
        `new interval  = [${newI[0]}, ${newI[1]}]  width/d = ${(newI[1]-newI[0])/newI[0]}\n` +
        `old interval contains reference: ${contains(oldI, dRef)}\n` +
        `new interval contains reference: ${contains(newI, dRef)}`
    );

    // the old interval is far too narrow: it misses the reference value
    expect(contains(oldI, dRef)).toBe(false);
    // its claimed relative width is just ~2*eps (a couple of ulps)...
    expect((oldI[1] - oldI[0]) / oldI[0]).toBeLessThan(4*eps);
    // ...while the reference lies ~1000*eps away from it
    const dRefApprox = dRef[1] + dRef[0];
    expect(Math.abs(dRefApprox - oldI[1]) / oldI[1]).toBeGreaterThan(100*eps);

    // the certified interval contains it and is only ~8*eps wide
    expect(contains(newI, dRef)).toBe(true);
    expect((newI[1] - newI[0]) / newI[0]).toBeLessThan(16*eps);
});


test('getEndpointInfoCertified - always contains the reference, old version does not', function() {
    // sweep a few parameters and offsets on a curve far from the origin
    const ps = [[5000,3000],[5400,3900],[6100,2200],[6000,3000]];
    const curve = { ps } as Curve;

    let oldMisses = 0;
    let checks = 0;
    for (const t of [0.1, 0.3, 0.45, 0.7, 0.9]) {
        const p = evalDeCasteljauDd(ps, [0,t]).map(v => v[0] + v[1]);
        for (const off of [[0.5,0.25],[-1,0.75],[2,-3],[0.1,-0.1]]) {
            const x = [p[0] + off[0], p[1] + off[1]];
            const dRef = squaredDistanceDd(ps, t, x);

            expect(contains(getEndpointInfoCertified(curve, x, t).dSquaredI, dRef)).toBe(true);
            if (!contains(getEndpointInfoUncertified(curve, x, t).dSquaredI, dRef)) { oldMisses++; }
            checks++;
        }
    }

    // the old interval misses most of the time (it is only right by luck)
    expect(oldMisses).toBeGreaterThan(checks/2);
});


test('getEndpointInfoCertified - x (numerically) on the point: the lower bound is 0', function() {
    const ps = [[1000,0],[1300,0],[1700,0],[2000,0]];
    const curve = { ps } as Curve;
    const t = 0.3;
    const x = evalDeCasteljauDd(ps, [0,t]).map(v => v[0] + v[1]);  // the rounded point

    const [lo, hi] = getEndpointInfoCertified(curve, x, t).dSquaredI;
    // the true distance is about the rounding error of the point (~1e-13)
    expect(lo).toBeGreaterThanOrEqual(0);
    expect(hi).toBeLessThan(1e-24);
    expect(contains([lo, hi], squaredDistanceDd(ps, t, x))).toBe(true);
});


test('getEndpointInfoCertified - endpoint at t=0 is attributed to the previous curve', function() {
    const prev = { ps: [[0,0],[10,0]] } as Curve;
    const curve = { ps: [[10,0],[10,10]], prev } as Curve;
    const info = getEndpointInfoCertified(curve, [10,-1], 0);
    expect(info.curve).toBe(prev);
    expect(info.t).toBe(1);
    expect(info.dSquaredI[0]).toBeLessThanOrEqual(1);
    expect(info.dSquaredI[1]).toBeGreaterThanOrEqual(1);
});
