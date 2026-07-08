import { expect, test } from '@jest/globals';
import { traverseEdges } from '../../../src/cp-node/fs/traverse-edges.js';
import { getMats1 } from '../../get-mats1.js';


test('traverseEdges', function() {
    const { cpNode } = getMats1()[0];

    const visited: (typeof cpNode)[] = [];
    traverseEdges(cpNode, cp => visited.push(cp));

    expect(visited.length).toBeGreaterThan(0);

    // traverseEdges uses a `seen` set internally, so no duplicates
    const visitedSet = new Set(visited);
    expect(visitedSet.size).toBe(visited.length);
});
