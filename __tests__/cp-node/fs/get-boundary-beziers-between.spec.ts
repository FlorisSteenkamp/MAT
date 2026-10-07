import { expect, test } from '@jest/globals';
import { totalLength } from 'flo-bezier3';
import { getBoundaryBeziersBetween } from '../../../src/cp-node/fs/get-boundary-beziers-between.js';
import { getBoundaryBeziersToNext } from '../../../src/cp-node/fs/get-boundary-beziers-to-next.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { getMatsWithHole } from '../../get-mats-with-hole.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';
import { expectBeziersConnected, expectPointClose } from '../../helpers/expect-point-close.js';


const length = (pss: number[][][]) => pss.reduce((s, ps) => s + totalLength(ps), 0);


test('getBoundaryBeziersBetween', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    // to the next node: same as `getBoundaryBeziersToNext`
    for (const cp of getAllOnLoop(cpNode)) {
        const { pss, hasHoleCloser } = getBoundaryBeziersBetween(cp, cp.next);
        expect(pss).toEqual(getBoundaryBeziersToNext(cp));
        expect(hasHoleCloser).toBe(false);
    }

    {
        // from [46,18.5] (id 147) around two corners to [117,54] (id 4):
        // 35.5 up, 71 across - the piece leaving the end node is not included
        const { pss, hasHoleCloser } = getBoundaryBeziersBetween(byId(147), byId(4));
        expect(hasHoleCloser).toBe(false);
        expectPointClose(pss[0][0], [46,18.5]);
        expectPointClose(pss[pss.length-1][1], [117,54]);
        expectBeziersConnected(pss);
        expect(length(pss)).toBeCloseTo(35.5 + 71, 8);
    }

    // equal start and end: everything or nothing
    const perimeter = cpNode.pointOnShape.curve.loop.curves
        .reduce((s, curve) => s + totalLength(curve.ps), 0);
    {
        const { pss } = getBoundaryBeziersBetween(cpNode, cpNode);
        expect(length(pss)).toBeCloseTo(perimeter, 8);
        expectBeziersConnected(pss);
        expectPointClose(pss[pss.length-1][1], pss[0][0]);
    }
    {
        const { pss } = getBoundaryBeziersBetween(cpNode, cpNode, true);
        expect(length(pss)).toBeCloseTo(perimeter, 8);
    }
    {
        const { pss, hasHoleCloser } = getBoundaryBeziersBetween(cpNode, cpNode, false);
        expect(pss).toEqual([]);
        expect(hasHoleCloser).toBe(false);
    }
});


test('getBoundaryBeziersBetween - hole closers', function() {
    const { cpNode } = getMatsWithHole()[0];

    // going all the way round passes the hole closers
    const { hasHoleCloser } = getBoundaryBeziersBetween(cpNode, cpNode);
    expect(hasHoleCloser).toBe(true);

    // ...but a stretch without any hole closer reports none
    const cps = getAllOnLoop(cpNode);
    const i = cps.findIndex((cp, i) =>
        !cp.isHoleClosing && !cps[(i+1) % cps.length].isHoleClosing);
    expect(i).toBeGreaterThanOrEqual(0);
    const cp = cps[i];
    expect(getBoundaryBeziersBetween(cp, cp.next.next).hasHoleCloser).toBe(false);
});
