import { expect, test } from '@jest/globals';
import type { PrePointOnShape } from '../../../src/point-on-shape/point-on-shape';
import { getClosestPoint } from '../../../src/find-2-prong/get-medial/get-closest-points';
import { CurvePiece } from '../../../src/mat/curve-piece';
import { Curve } from 'flo-boolean';
import { getCurvatureExtremaDd } from 'flo-bezier3';
import { deflate } from 'flo-poly';
import { translate } from 'flo-vector2d';


test('getClosestPoints', function() {
    const maxPowerOf2 = 11;
    const nnorm = [20.25, 239];
    const ps = [[610, -20], [484, -20], [384, 20.5]];
    const t = 0.25;
    const p = [548.625, -17.46875];
    const xO = translate(p, nnorm);//?
    const curve: Curve = {
        idx: 0,
        ps,
        prev: undefined!,  // just used for comparing by function
        loop: undefined!,  // not used by function
        next: undefined!   // ...
    };

    const yPos: PrePointOnShape = {
        isSource: true,
        p, t, curve
    };
    const for1Prong = false;
    const angle = 0;
    const curvePiece: CurvePiece = { ts: [0,1], curve };

    getCurvatureExtremaDd(ps);  //=> none

    const H = [
        47279295, -169198895.25, 139649335.875, -48674806.03125, 7804659.76171875,
        -476248.4384765625
    ];

    const def = deflate(H,t);//?
    // def = [47279295, -157379071.5, 100304568, -23598664.03125, 1904993.75390625]

    const r = getClosestPoint(maxPowerOf2, nnorm, yPos, for1Prong, angle, curvePiece);

    r;//?

    expect(true).toBe(true);
});
