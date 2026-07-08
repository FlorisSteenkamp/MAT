import { expect, test } from '@jest/globals';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('isTerminating', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    // A non-trivial MAT should have at least one terminating node
    const termCount = allOnLoop.filter(isTerminating).length;
    expect(termCount).toBeGreaterThan(0);

    // Verify the definition: cpNode === cpNode.next.prevOnCircle
    for (const n of allOnLoop) {
        expect(isTerminating(n)).toBe(n === n.next.prevOnCircle);
    }
});
