import { expect, test } from '@jest/globals';
import { cross, fromTo, toUnitVector, translate } from 'flo-vector2d';
import { getBeziersFromTangents } from '../../src/utils/get-beziers-from-tangents.js';
import { expectBezierClose, expectBeziersConnected, expectPointClose } from '../helpers/expect-point-close.js';


const startTan = (ps: number[][]) => toUnitVector(fromTo(ps[0], ps[1]));
const endTan   = (ps: number[][]) => toUnitVector(fromTo(ps[ps.length-2], ps[ps.length-1]));
/** tangent line at `p` with direction `angle` radians from the x-axis */
const line = (p: number[], angle: number) =>
    [p, translate(p, [Math.cos(angle), Math.sin(angle)])];


test('getBeziersFromTangents - not twisted: a single quadratic', function() {
    // tangents (1,1) at [0,0] and (1,-1) at [10,0] meet at [5,5]
    const pss = getBeziersFromTangents(line([0,0], Math.PI/4), line([10,0], -Math.PI/4));
    expect(pss.length).toBe(1);
    expectBezierClose(pss[0], [[0,0],[5,5],[10,0]]);
});


test('getBeziersFromTangents - collinear: a line', function() {
    const pss = getBeziersFromTangents(line([0,0], 0), line([10,0], 0));
    expect(pss).toEqual([[[0,0],[10,0]]]);
});


test('getBeziersFromTangents - collinear with the intersection landing on an endpoint: a line', function() {
    // From the `getMats1` fixture (edge 3 -> 145): both tangents point along
    // the chord [46,54] -> [81.5,18.5] but numerically the lines intersect
    // exactly at the end point. This must not produce a degenerate quadratic
    // `[p0, p1, p1]` (with a zero end tangent) but a line.
    const s = Math.SQRT1_2;
    const l0 = [[46,54], [46+s, 54-s]];
    const l1 = [[81.5,18.5], [81.5-s, 18.5+s]];
    const pss = getBeziersFromTangents(l0, l1);
    expect(pss.length).toBe(1);
    expect(pss[0].length).toBe(2);
    expectPointClose(pss[0][0], [46,54]);
    expectPointClose(pss[0][1], [81.5,18.5]);
});


test('getBeziersFromTangents - twisted (inflection): two quadratics', function() {
    // tangents tilted to the *same* side at both ends force an S-shape
    const cases = [
        { p0: [0,0], p1: [10,0], a0:  0.006, a1:  0.006 },  // symmetric
        { p0: [0,0], p1: [10,0], a0:  0.008, a1:  0.001 },  // asymmetric
        { p0: [3,7], p1: [9,2],  a0: -0.007, a1: -0.004 },  // rotated chord
    ];
    for (const { p0, p1, a0, a1 } of cases) {
        const chordAngle = Math.atan2(p1[1]-p0[1], p1[0]-p0[0]);
        const l0 = line(p0, chordAngle + a0);
        const l1 = line(p1, chordAngle + a1);
        const d0 = fromTo(l0[0], l0[1]);
        const d1 = fromTo(l1[0], l1[1]);

        const pss = getBeziersFromTangents(l0, l1);
        expect(pss.length).toBe(2);
        expect(pss[0].length).toBe(3);
        expect(pss[1].length).toBe(3);

        // endpoints and end tangents are exact
        expect(pss[0][0]).toBe(p0);
        expect(pss[1][2]).toBe(p1);
        expect(cross(startTan(pss[0]), d0)).toBeCloseTo(0, 12);
        expect(cross(endTan(pss[1]), d1)).toBeCloseTo(0, 12);

        // joined, and smoothly so
        expectBeziersConnected(pss, 12);
        expect(cross(endTan(pss[0]), startTan(pss[1]))).toBeCloseTo(0, 12);

        // control points lie on the tangent lines at 1/4 and 3/4 of the chord
        const c = fromTo(p0, p1);
        const along = (p: number[]) =>
            (fromTo(p0, p)[0]*c[0] + fromTo(p0, p)[1]*c[1]) / (c[0]**2 + c[1]**2);
        expect(along(pss[0][1])).toBeCloseTo(1/4, 9);
        expect(along(pss[1][1])).toBeCloseTo(3/4, 9);
        expect(cross(fromTo(p0, pss[0][1]), d0)).toBeCloseTo(0, 9);
        expect(cross(fromTo(p1, pss[1][1]), d1)).toBeCloseTo(0, 9);
    }
});


test('getBeziersFromTangents - twisted but within tolerance: a line', function() {
    // barely twisted: a straight line will do
    const pss = getBeziersFromTangents(line([0,0], 1e-6), line([10,0], 1e-6));
    expect(pss.length).toBe(1);
    expectBezierClose(pss[0], [[0,0],[10,0]]);
});


test('getBeziersFromTangents - too twisted: falls back to a line', function() {
    // FUTURE: should add a 2-prong instead
    const pss = getBeziersFromTangents(line([0,0], 0.1), line([10,0], 0.1));
    expect(pss.length).toBe(1);
    expectPointClose(pss[0][0], [0,0]);
    expectPointClose(pss[0][1], [10,0]);
});
