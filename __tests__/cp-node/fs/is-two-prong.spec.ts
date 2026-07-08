import { expect, test } from '@jest/globals';
import { isTwoProng } from '../../../src/cp-node/fs/is-two-prong.js';
import { getRealProngCount } from '../../../src/cp-node/fs/get-real-prong-count.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('isTwoProng', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    for (const n of allOnLoop) {
        expect(isTwoProng(n)).toBe(getRealProngCount(n) === 2);
    }
});
