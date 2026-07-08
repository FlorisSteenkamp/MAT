import { expect, test } from '@jest/globals';
import { getChildren } from '../../../src/cp-node/fs/get-children.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('getChildren', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    const nonTerminating = allOnLoop.find(n => !isTerminating(n));
    expect(nonTerminating).toBeDefined();

    const children = getChildren(nonTerminating!);
    expect(children.length).toBeGreaterThan(0);

    for (const child of children) {
        expect(child.next).toBeDefined();
        expect(child.prev).toBeDefined();
    }
});
