import { expect, test } from '@jest/globals';
import { distanceBetween } from 'flo-vector2d';
import { getMatDistanceToNext, getMatDistanceToNext$ } from '../../../src/cp-node/fs/get-distance-to-next.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


test('getMatDistanceToNext', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);
    const chord = (cp: typeof cpNode) => distanceBetween(
        cp.pointOnShape.circle.center,
        cp.next.pointOnShape.circle.center
    );

    // straight MAT edges: the arc length is the distance between the centers
    // 3-prong center [81.5,18.5] -> sharp corner [46,54]
    expect(getMatDistanceToNext(byId(147))).toBeCloseTo(35.5*Math.SQRT2, 9);
    // sharp corner [24,8] -> 2-prong center [46,-5.21425847941623] (along the
    // bisector of the corner)
    expect(getMatDistanceToNext(byId(1))).toBeCloseTo(Math.hypot(22, 8 + 5.21425847941623), 9);

    // a curved MAT edge (equidistant from a corner point and a line, i.e. a
    // parabola) is strictly longer than its chord
    expect(getMatDistanceToNext(byId(10))).toBeGreaterThan(chord(byId(10)) + 0.01);

    // the two nodes at a 1-prong share a center
    expect(getMatDistanceToNext(byId(0))).toBe(0);

    for (const cp of getAllOnLoop(cpNode)) {
        const d = getMatDistanceToNext(cp);
        // never shorter than the chord
        expect(d).toBeGreaterThanOrEqual(chord(cp) - 1e-9);
        if (isTerminating(cp)) { expect(d).toBe(0); }
        // the memoized version agrees
        expect(getMatDistanceToNext$(cp)).toBe(d);
    }
});
