import { expect, test } from '@jest/globals';
import { getProngCount } from '../../../src/cp-node/fs/get-prong-count.js';
import { getMats1 } from '../../get-mats1.js';


test('getProngCount', function() {
    const { cpNode } = getMats1()[0];

    const count = getProngCount(cpNode);
    expect(count).toBeGreaterThanOrEqual(2);

    // Manually counting nextOnCircle traversal should match
    let circleCount = 0;
    let curr = cpNode;
    do {
        circleCount++;
        curr = curr.nextOnCircle;
    } while (curr !== cpNode);
    expect(circleCount).toBe(count);
});
