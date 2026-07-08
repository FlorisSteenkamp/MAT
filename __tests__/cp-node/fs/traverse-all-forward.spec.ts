import { expect, test } from '@jest/globals';
import { traverseAllForward } from '../../../src/cp-node/fs/traverse-all-forward.js';
import { getMats1 } from '../../get-mats1.js';


test('traverseAllForward', function() {
    const { cpNode } = getMats1()[0];

    const visited: (typeof cpNode)[] = [];
    traverseAllForward(cpNode, cp => visited.push(cp));

    expect(visited.length).toBeGreaterThan(0);
    expect(visited[0] === cpNode).toBe(true);
});
