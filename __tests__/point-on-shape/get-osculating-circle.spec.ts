import { expect, test } from '@jest/globals';
import { loopFromBeziers } from 'flo-boolean';
import { getOsculatingCircle } from '../../src/point-on-shape/get-osculating-circle.js';


const minRadius = 2**-12;
const maxRadius = 1000;


test('`getOsculatingCircle` at a regular point', function() {
    // parabola apex at `[1,0.5]` with radius of curvature `1`
    const ps = [[0,0],[1,1],[2,0]];
    const pos = getPos(ps, 0.5, [1,0.5]);
    const norm = [0,-2];  // towards the center

    expect(getOsculatingCircle(minRadius, maxRadius, pos, norm))
        .toEqual([[1,-0.5], 1]);

    // radius `1` is too small
    expect(getOsculatingCircle(2, maxRadius, pos, norm)).toBeUndefined();

    // radius is clamped to the max
    expect(getOsculatingCircle(minRadius, 0.5, pos, norm))
        .toEqual([[1,0], 0.5]);
});


// Bezier 63 of glyph `aq_H` (achispado.svg) and the inward normal at its end
// (the curve arrives there going in -x)
const p = [257,646];
const norm = [0,3];


test('`getOsculatingCircle` at an end whose last control point equals the end point', function() {
    const ps = [[260,650],[260,646],[257,646],[257,646]];

    // infinite curvature, i.e. radius `0` - too small
    expect(getOsculatingCircle(minRadius, maxRadius, getPos(ps, 1, p), norm))
        .toBeUndefined();
});


test('`getOsculatingCircle` at an end whose last control point is snapped next to the end point', function() {
    const ps = [[260,650],[260,646],[257.0000000000291,646],[257,646]];

    // curvature `0` at the end so the radius is clamped to the max
    expect(getOsculatingCircle(minRadius, maxRadius, getPos(ps, 1, p), norm))
        .toEqual([[257, 646 + maxRadius], maxRadius]);
});


function getPos(
        ps: number[][],
        t: number,
        p: number[]) {

    // close the loop with a line (else `loopFromBeziers` moves the end point)
    const closingLine = [ps[ps.length-1], ps[0]];
    const curve = loopFromBeziers([ps, closingLine], 0).curves[0];

    return { curve, t, isSource: true, p, pDd: [[0,p[0]],[0,p[1]]] };
}
