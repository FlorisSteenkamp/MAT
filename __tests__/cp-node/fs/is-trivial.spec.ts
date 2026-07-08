import { expect, test } from '@jest/globals';
import { isTrivial } from '../../../src/cp-node/fs/is-trivial.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getAllOnCircle } from '../../../src/cp-node/fs/get-all-on-circle.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('isTrivial', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    for (const n of allOnLoop) {
        const expected = getAllOnCircle(n).every(isTerminating);
        expect(isTrivial(n)).toBe(expected);
    }
});
