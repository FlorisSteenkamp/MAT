import { expect, test } from '@jest/globals';
import { isOneProng } from '../../../src/cp-node/fs/is-one-prong.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('isOneProng', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    for (const n of allOnLoop) {
        if (isOneProng(n)) {
            // One-prong: nextOnCircle is at the same position
            const p1 = n.cp.pointOnShape.p;
            const p2 = n.nextOnCircle.cp.pointOnShape.p;
            expect(p1[0]).toBe(p2[0]);
            expect(p1[1]).toBe(p2[1]);
        }
    }
});
