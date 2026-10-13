import { expect, test } from '@jest/globals';
import { distanceBetween } from 'flo-vector2d';
import { getSalience } from '../../../src/cp-node/fs/get-salience.js';
import { getBoundaryBeziersBetween } from '../../../src/cp-node/fs/get-boundary-beziers-between.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getAllOnLoop_ByLoop } from '../../../src/cp-node/fs/get-all-on-loop-by-loop.js';
import { getRealProngCount } from '../../../src/cp-node/fs/get-real-prong-count.js';
import { getMats1 } from '../../get-mats1.js';
import { getMatsWithHole } from '../../get-mats-with-hole.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


test('getSalience', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    // Salience = (boundary length from this contact point forward to the next
    // contact point on the circle) / (straight distance between them).

    {
        // 2-prong {10,11} touching [46,8] and a point on the other edge of the
        // corner [24,8]: from id 11 the boundary runs to the corner and on to
        // [46,8] - two equal tangent lengths of 22.
        const cp = byId(11);
        const d = distanceBetween(cp.pointOnShape.p, cp.nextOnCircle.pointOnShape.p);
        expect(getSalience(cp)).toBeCloseTo(44/d, 9);
    }
    {
        // 3-prong {142,143,144}: from [46,8] (id 144) forward to [117,8]
        // (id 142) the boundary goes round the top of the rectangle:
        // 46 + 71 + 46 = 163, against a chord of 71.
        expect(getSalience(byId(144))).toBeCloseTo(163/71, 9);
    }

    // the boundary is never shorter than the chord
    for (const cp of getAllOnLoop(cpNode)) {
        if (getRealProngCount(cp) < 2) { continue; }  // 1-prongs: see below
        const s = getSalience(cp);
        expect(Number.isFinite(s)).toBe(true);
        expect(s).toBeGreaterThanOrEqual(1);
    }

    // 1-prongs (two nodes at the same point): the terminating node has no
    // boundary between itself and its twin - salience 0 - while the twin has
    // the entire boundary - salience Infinity. Ids 0 and 1 at the corner
    // [24,8] are such a pair.
    expect(getSalience(byId(0))).toBe(0);
    expect(getSalience(byId(1))).toBe(Infinity);
    for (const cp of getAllOnLoop(cpNode)) {
        if (getRealProngCount(cp) >= 2) { continue; }
        const s = getSalience(cp);
        expect(Number.isNaN(s)).toBe(false);
        expect(s === 0 || s === Infinity).toBe(true);
    }
});


test('getSalience - hole closers', function() {
    const { cpNode } = getMatsWithHole()[0];

    // a stretch of boundary passing a hole closer has infinite salience
    const cpNodes = getAllOnLoop_ByLoop(cpNode).flat();
    let infinite = 0;
    for (const cp of cpNodes) {
        const { hasHoleCloser } = getBoundaryBeziersBetween(cp, cp.nextOnCircle);
        if (hasHoleCloser) {
            infinite++;
            expect(getSalience(cp)).toBe(Infinity);
        }
    }
    expect(infinite).toBeGreaterThan(0);
});
