import { expect, test } from '@jest/globals';
import { isSharp } from '../../../src/cp-node/fs/is-sharp.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('isSharp', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    for (const n of allOnLoop) {
        expect(isSharp(n)).toBe(n.cp.circle.radius === 0);
    }
});
