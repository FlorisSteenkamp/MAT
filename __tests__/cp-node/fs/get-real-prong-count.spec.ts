import { expect, test } from '@jest/globals';
import { getRealProngCount } from '../../../src/cp-node/fs/get-real-prong-count.js';
import { getProngCount } from '../../../src/cp-node/fs/get-prong-count.js';
import { getMats1 } from '../../get-mats1.js';


test('getRealProngCount', function() {
    const { cpNode } = getMats1()[0];

    const realCount = getRealProngCount(cpNode);
    expect(realCount).toBeGreaterThanOrEqual(1);

    // Real count excludes terminating nodes, so it's <= total prong count
    expect(realCount).toBeLessThanOrEqual(getProngCount(cpNode));
});
