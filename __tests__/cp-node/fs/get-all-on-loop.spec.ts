import { expect, test } from '@jest/globals';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('getAllOnLoop', function() {
    const { cpNode } = getMats1()[0];
    const cpNodes = getAllOnLoop(cpNode);

    expect(cpNodes.length).toBeGreaterThan(0);
    expect(cpNodes[0] === cpNode).toBe(true);

    // Each node's .next should point to the next node in the array (wrapping)
    for (let i = 0; i < cpNodes.length; i++) {
        expect(cpNodes[i].next === cpNodes[(i + 1) % cpNodes.length]).toBe(true);
    }

    // Starting from cpNode.next should give the same count
    expect(getAllOnLoop(cpNode.next).length).toBe(cpNodes.length);
});
