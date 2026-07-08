import { expect, test } from '@jest/globals';
import { isFullyTerminating } from '../../../src/cp-node/fs/is-fully-terminating.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getAllOnCircle } from '../../../src/cp-node/fs/get-all-on-circle.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('isFullyTerminating', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    for (const n of allOnLoop) {
        if (isFullyTerminating(n)) {
            // All on the prevOnCircle's circle (excluding itself) should be terminating
            const otherOnCircle = getAllOnCircle(n.prevOnCircle, true);
            expect(otherOnCircle.every(isTerminating)).toBe(true);
        }
    }
});
