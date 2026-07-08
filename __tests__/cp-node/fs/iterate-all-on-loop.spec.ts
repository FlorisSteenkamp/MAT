import { expect, test } from '@jest/globals';
import { iterateAllOnLoop } from '../../../src/cp-node/fs/iterate-all-on-loop.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('iterateAllOnLoop', function() {
    const { cpNode } = getMats1()[0];

    const iterated = [...iterateAllOnLoop(cpNode)];
    const expected = getAllOnLoop(cpNode);

    expect(iterated.length).toBe(expected.length);
    for (let i = 0; i < iterated.length; i++) {
        expect(iterated[i] === expected[i]).toBe(true);
    }
});
