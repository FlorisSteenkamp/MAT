import { expect, test } from '@jest/globals';
import { ddCurvature } from 'flo-bezier3';
import { getCurvature } from '../../src/point-on-shape/get-osculating-circle.js';


// Bezier 63 of glyph `aq_H` (achispado.svg): its last control point equals its
// end point, so the first derivative vanishes at `t === 1`
const psEqual = [[260,650],[260,646],[257,646],[257,646]];
// The same bezier after grid-snapping by `simplifyPaths`
const psSnapped = [[260,650],[260,646],[257.0000000000291,646],[257,646]];


test('`getCurvature` at a regular point', function() {
    // parabola apex at `[1,0.5]` with radius of curvature `1`
    const ps = [[0,0],[1,1],[2,0]];

    expect(getCurvature(ps, 0.5)).toEqual(1);
});


test('`getCurvature` at an end whose last control point equals the end point', function() {
    // `ddCurvature` gives `0/0`
    const kDd = ddCurvature(psEqual, 1);
    expect(kDd[0]).toBeNaN();
    expect(kDd[1]).toBeNaN();

    expect(getCurvature(psEqual, 1)).toEqual(Infinity);
});


test('`getCurvature` at an end whose last control point is snapped next to the end point', function() {
    // first and second derivatives are both horizontal there so the exact
    // curvature of the snapped curve at `t === 1` is `0`
    expect(getCurvature(psSnapped, 1)).toEqual(0);
});


test('`getCurvature` at a degenerate end is signed by the side the curve bends to', function() {
    // mirrored (in `y = 646`) so it bends the other way
    const psMirrored = [[260,642],[260,646],[257,646],[257,646]];
    expect(getCurvature(psMirrored, 1)).toEqual(-Infinity);

    // reversed so the degenerate end is at `t === 0`
    const psReversed = psEqual.slice().reverse();
    expect(getCurvature(psReversed, 0)).toEqual(-Infinity);
});


test('`getCurvature` at a degenerate end of a straight curve', function() {
    const ps = [[0,0],[5,5],[5,5],[5,5]];

    expect(getCurvature(ps, 1)).toEqual(0);
});
