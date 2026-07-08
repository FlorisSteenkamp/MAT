import { expect, test } from '@jest/globals';
import { isSpecial } from '../../../src/cp-node/fs/is-special.js';
import { getRealProngCount } from '../../../src/cp-node/fs/get-real-prong-count.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('isSpecial', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    for (const n of allOnLoop) {
        const expected = getRealProngCount(n) !== 2 && !n.isHoleClosing;
        expect(isSpecial(n)).toBe(expected);
    }
});
