import { expect, test } from '@jest/globals';
import { isOnSameCircle } from '../../../src/cp-node/fs/is-on-same-circle.js';
import { getMats1 } from '../../get-mats1.js';


test('isOnSameCircle', function() {
    const { cpNode } = getMats1()[0];

    // A node is on the same circle as itself
    expect(isOnSameCircle(cpNode, cpNode)).toBe(true);

    // A node is on the same circle as nextOnCircle
    expect(isOnSameCircle(cpNode, cpNode.nextOnCircle)).toBe(true);

    // Symmetric
    expect(isOnSameCircle(cpNode.nextOnCircle, cpNode)).toBe(true);

    // All nodes reachable via nextOnCircle are on the same circle
    let curr = cpNode.nextOnCircle;
    while (curr !== cpNode) {
        expect(isOnSameCircle(cpNode, curr)).toBe(true);
        curr = curr.nextOnCircle;
    }
});
