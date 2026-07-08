import { expect, test } from '@jest/globals';
import { getAllVertices } from '../../../src/cp-node/fs/get-all-vertices.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('getAllVertices', function() {
    const { cpNode } = getMats1()[0];
    const vertices = getAllVertices(cpNode);

    expect(vertices.length).toBeGreaterThan(0);

    // All returned vertices should be on the loop
    const loopSet = new Set(getAllOnLoop(cpNode));
    for (const v of vertices) {
        expect(loopSet.has(v)).toBe(true);
    }
});
