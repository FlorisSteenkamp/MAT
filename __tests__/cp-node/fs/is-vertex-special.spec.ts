import { expect, test } from '@jest/globals';
import { isVertexSpecial } from '../../../src/cp-node/fs/is-vertex-special.js';
import { isVertex } from '../../../src/cp-node/fs/is-vertex.js';
import { isSpecial } from '../../../src/cp-node/fs/is-special.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('isVertexSpecial', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    // isVertexSpecial === isVertex(isSpecial)
    for (const n of allOnLoop) {
        expect(isVertexSpecial(n)).toBe(isVertex(isSpecial)(n));
    }
});
