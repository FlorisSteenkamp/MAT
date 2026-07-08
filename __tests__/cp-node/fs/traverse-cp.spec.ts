import { expect, test } from '@jest/globals';
import { traverseCp } from '../../../src/cp-node/fs/traverse-cp.js';
import { getMats1 } from '../../get-mats1.js';


test('traverseCp', function() {
    const { cpNode } = getMats1()[0];

    const visited = traverseCp(cpNode);

    expect(visited.length).toBeGreaterThan(0);
    expect(visited[0] === cpNode).toBe(true);
});
