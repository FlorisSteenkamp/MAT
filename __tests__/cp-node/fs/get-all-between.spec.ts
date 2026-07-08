import { expect, test } from '@jest/globals';
import { getAllBetween } from '../../../src/cp-node/fs/get-all-between.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('getAllBetween', function() {
    const { cpNode } = getMats1()[0];

    // Same start and end (inclAllIfEqual=true): returns all nodes on the loop
    const all = getAllBetween(cpNode, cpNode);
    expect(all.cpNodes.length).toBe(getAllOnLoop(cpNode).length);
    expect(all.cpNodes[0] === cpNode).toBe(true);

    // Same start and end with inclAllIfEqual=false: returns empty
    const none = getAllBetween(cpNode, cpNode, false);
    expect(none.cpNodes.length).toBe(0);

    // From cpNode to cpNode.next.next: returns [cpNode, cpNode.next]
    const two = getAllBetween(cpNode, cpNode.next.next);
    expect(two.cpNodes.length).toBe(2);
    expect(two.cpNodes[0] === cpNode).toBe(true);
    expect(two.cpNodes[1] === cpNode.next).toBe(true);
});
