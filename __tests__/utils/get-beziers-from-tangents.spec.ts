import { expect, test } from '@jest/globals';
import { cross, distanceBetween, fromTo, toUnitVector, translate } from 'flo-vector2d';
import { getBeziersFromTangents } from '../../src/utils/get-beziers-from-tangents.js';
import { expectBezierClose, expectBeziersConnected, expectPointClose } from '../helpers/expect-point-close.js';


const startTan = (ps: number[][]) => toUnitVector(fromTo(ps[0], ps[1]));
const endTan   = (ps: number[][]) => toUnitVector(fromTo(ps[ps.length-2], ps[ps.length-1]));
/** tangent line at `p` with direction `angle` radians from the x-axis (and the given length) */
const line = (p: number[], angle: number, length = 1) =>
    [p, translate(p, [length*Math.cos(angle), length*Math.sin(angle)])];


/** The invariants of a twisted result: two quadratics, exact ends, smooth join. */
function checkTwoQuadratics(pss: number[][][], p0: number[], p1: number[], d0: number[], d1: number[]) {
    expect(pss.length).toBe(2);
    expect(pss[0].length).toBe(3);
    expect(pss[1].length).toBe(3);

    // endpoints and end tangents are exact
    expect(pss[0][0]).toBe(p0);
    expect(pss[1][2]).toBe(p1);
    expect(cross(startTan(pss[0]), toUnitVector(d0))).toBeCloseTo(0, 12);
    expect(cross(endTan(pss[1]), toUnitVector(d1))).toBeCloseTo(0, 12);

    // joined, and smoothly so
    expectBeziersConnected(pss, 12);
    expect(cross(endTan(pss[0]), startTan(pss[1]))).toBeCloseTo(0, 12);

    // control points lie on the tangent lines a quarter chord away from the
    // endpoints, towards the other endpoint
    const chord = distanceBetween(p0, p1);
    expect(distanceBetween(p0, pss[0][1])).toBeCloseTo(chord/4, 9);
    expect(distanceBetween(p1, pss[1][1])).toBeCloseTo(chord/4, 9);
    expect(distanceBetween(pss[0][1], p1)).toBeLessThan(distanceBetween(p0, p1) + chord/4);
    expect(distanceBetween(pss[1][1], p0)).toBeLessThan(distanceBetween(p0, p1) + chord/4);
}


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
        { p0: [0,0], p1: [10,0], a0:  0.5,   a1:  0.3   },  // strongly twisted
        { p0: [0,0], p1: [10,0], a0:  Math.PI/2, a1: Math.PI/2 },  // tangents perpendicular to the chord
    ];
    for (const { p0, p1, a0, a1 } of cases) {
        const chordAngle = Math.atan2(p1[1]-p0[1], p1[0]-p0[0]);
        const l0 = line(p0, chordAngle + a0);
        const l1 = line(p1, chordAngle + a1);
        const d0 = fromTo(l0[0], l0[1]);
        const d1 = fromTo(l1[0], l1[1]);

        checkTwoQuadratics(getBeziersFromTangents(l0, l1), p0, p1, d0, d1);
    }
});


test('getBeziersFromTangents - scale, tangent magnitude and orientation do not matter', function() {
    const p0 = [0,0], p1 = [10,0];
    const ref = getBeziersFromTangents(line(p0, 0.006), line(p1, 0.006));

    const expectSame = (pss: number[][][]) => {
        expect(pss.length).toBe(ref.length);
        pss.forEach((ps, i) => ps.forEach((p, k) => expectPointClose(p, ref[i][k], 9)));
    };
    // tangent magnitude (e.g. an unnormalized bezier derivative)
    expectSame(getBeziersFromTangents(line(p0, 0.006, 123.4), line(p1, 0.006, 0.001)));
    // tangent orientation (either direction along the tangent line)
    expectSame(getBeziersFromTangents(line(p0, 0.006 + Math.PI), line(p1, 0.006)));
    expectSame(getBeziersFromTangents(line(p0, 0.006), line(p1, 0.006 + Math.PI)));
    // scale: the same configuration scaled by 1000 (and by 1/1000) gives the
    // same *kind* of result, scaled
    for (const s of [1000, 1/1000]) {
        const pss = getBeziersFromTangents(line([0,0], 0.006), line([10*s,0], 0.006));
        expect(pss.length).toBe(ref.length);
        pss.forEach((ps, i) => ps.forEach((p, k) => {
            expectPointClose(p, [ref[i][k][0]*s, ref[i][k][1]*s], 9);
        }));
    }
});


test('getBeziersFromTangents - twisted but within tolerance: a line', function() {
    // barely twisted (sine of the angle below 2**-16): a straight line will do
    const pss = getBeziersFromTangents(line([0,0], 1e-6), line([10,0], 1e-6));
    expect(pss.length).toBe(1);
    expectBezierClose(pss[0], [[0,0],[10,0]]);
    // ...at any scale
    const pss2 = getBeziersFromTangents(line([0,0], 1e-6), line([1e6,0], 1e-6));
    expect(pss2.length).toBe(1);
    expect(pss2[0].length).toBe(2);
    // ...but just above the tolerance it is two quadratics
    expect(getBeziersFromTangents(line([0,0], 2e-5), line([10,0], 2e-5)).length).toBe(2);
});


test('getBeziersFromTangents - coinciding endpoints: a degenerate line', function() {
    const p = [46,8];
    const pss = getBeziersFromTangents([p, [47,8]], [p, [46,9]]);
    expect(pss).toEqual([[p, p]]);
    // the same from the two nodes of a 1-prong (identical tangent lines)
    expect(getBeziersFromTangents([p, [47,9]], [p, [47,9]])).toEqual([[p, p]]);
});


test('getBeziersFromTangents - degenerate tangent: a line', function() {
    const pss = getBeziersFromTangents([[0,0], [0,0]], line([10,0], 0.3));
    expect(pss).toEqual([[[0,0],[10,0]]]);
});
