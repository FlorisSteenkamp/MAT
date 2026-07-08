import { expect, test } from '@jest/globals';
import { clone } from '../../../src/cp-node/fs/clone.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('clone', function() {
    const { cpNode } = getMats1()[0];
    const cloned = clone(cpNode);

    expect(cloned === cpNode).toBe(false);

    const origLoop = getAllOnLoop(cpNode);
    const cloneLoop = getAllOnLoop(cloned);
    expect(cloneLoop.length).toBe(origLoop.length);

    expect(cloned.next.prev === cloned).toBe(true);
    expect(cloned.prev.next === cloned).toBe(true);
    expect(cloned.nextOnCircle.prevOnCircle === cloned).toBe(true);
    expect(cloned.prevOnCircle.nextOnCircle === cloned).toBe(true);

    expect(cloned.next !== cpNode.next).toBe(true);
});
