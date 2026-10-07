import { expect, test } from '@jest/globals';
import { getImpliedBoundaryBezierBetween } from '../../../src/cp-node/fs/get-implied-boundary-bezier-between.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';
import { expectBezierClose, expectBeziersConnected, expectPointClose } from '../../helpers/expect-point-close.js';


test('getImpliedBoundaryBezierBetween', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    // Both points on the same straight boundary line: a single line.
    {
        const pss = getImpliedBoundaryBezierBetween(byId(147), byId(2));
        expect(pss.length).toBe(1);
        expectBezierClose(pss[0], [[46,18.5],[46,54]]);
    }
    {
        // the tangent at the corner [24,8] is taken from the *outgoing* curve
        const pss = getImpliedBoundaryBezierBetween(byId(1), byId(10));
        expect(pss.length).toBe(1);
        expectBezierClose(pss[0], [[24,8],[46,8]]);
    }
    {
        // ...and at [46,8] (id 10, end of curve 1) likewise, so [46,8] ->
        // [46,18.5] follows curve 2 (vertical)
        const pss = getImpliedBoundaryBezierBetween(byId(10), byId(147));
        expect(pss.length).toBe(1);
        expectBezierClose(pss[0], [[46,8],[46,18.5]]);
    }
    {
        // Tangents (1,0) at [24,8] and (0,1) at [46,18.5] meet at the (cut)
        // corner [46,8]: a single quadratic with that control point.
        const pss = getImpliedBoundaryBezierBetween(byId(1), byId(147));
        expect(pss.length).toBe(1);
        expectBezierClose(pss[0], [[24,8],[46,8],[46,18.5]]);
    }

    // For every pair of consecutive nodes the implied boundary runs from the
    // one point to the other.
    for (const cp of getAllOnLoop(cpNode)) {
        const pss = getImpliedBoundaryBezierBetween(cp, cp.next);
        expect(pss.length).toBeGreaterThan(0);
        expect(pss.length).toBeLessThanOrEqual(2);
        expectPointClose(pss[0][0], cp.pointOnShape.p);
        const last = pss[pss.length-1];
        expectPointClose(last[last.length-1], cp.next.pointOnShape.p);
        expectBeziersConnected(pss);
        for (const ps of pss) { expect([2,3]).toContain(ps.length); }
    }
});
