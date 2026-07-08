import { expect, test } from '@jest/globals';
import { traverseVertices } from '../../../src/cp-node/fs/traverse-vertices.js';
import { getMats1 } from '../../get-mats1.js';


test('traverseVertices', function() {
    const { cpNode } = getMats1()[0];

    const visited: (typeof cpNode)[] = [];
    traverseVertices(cpNode, cp => visited.push(cp));

    expect(visited.length).toBeGreaterThan(0);

    // cpStart is visited first
    expect(visited[0] === cpNode).toBe(true);
});
