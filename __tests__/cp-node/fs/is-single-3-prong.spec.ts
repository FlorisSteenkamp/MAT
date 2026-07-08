import { expect, test } from '@jest/globals';
import { isSingle3Prong } from '../../../src/cp-node/fs/is-single-3-prong.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('isSingle3Prong', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    for (const n of allOnLoop) {
        if (isSingle3Prong(n)) {
            expect(n.next === n.nextOnCircle).toBe(true);
            expect(n.next.next === n.next.nextOnCircle).toBe(true);
        }
    }
});
