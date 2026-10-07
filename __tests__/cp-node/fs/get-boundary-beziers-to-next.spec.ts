import { expect, test } from '@jest/globals';
import { getBoundaryBeziersToNext } from '../../../src/cp-node/fs/get-boundary-beziers-to-next.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';
import { expectBezierClose, expectBeziersConnected, expectPointClose } from '../../helpers/expect-point-close.js';


test('getBoundaryBeziersToNext', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    {
        // from the corner [24,8] (end of curve 0) to [46,8] (end of curve 1)
        const pss = getBoundaryBeziersToNext(byId(1));
        expect(pss.length).toBe(2);
        expectBezierClose(pss[0], [[24,8],[24,8]]);  // degenerate rest of curve 0
        expectBezierClose(pss[1], [[24,8],[46,8]]);  // all of curve 1
    }
    {
        // from [46,18.5] up to the corner [46,54] - part of a single line
        const pss = getBoundaryBeziersToNext(byId(147));
        expect(pss.length).toBe(1);
        expectBezierClose(pss[0], [[46,18.5],[46,54]]);
    }
    {
        // two nodes at the same point (a 1-prong corner) - zero length
        const pss = getBoundaryBeziersToNext(byId(0));
        expect(pss.length).toBe(1);
        expectBezierClose(pss[0], [[24,8],[24,8]]);
    }

    // For every node the beziers run from the point of this node to that of
    // the next, joined end to start.
    for (const cp of getAllOnLoop(cpNode)) {
        const pss = getBoundaryBeziersToNext(cp);
        expect(pss.length).toBeGreaterThan(0);
        expectPointClose(pss[0][0], cp.pointOnShape.p);
        const last = pss[pss.length-1];
        expectPointClose(last[last.length-1], cp.next.pointOnShape.p);
        expectBeziersConnected(pss);
        // the fixture boundary consists of lines only
        for (const ps of pss) { expect(ps.length).toBe(2); }
    }
});
