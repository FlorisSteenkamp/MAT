import { expect, test } from '@jest/globals';
import { isVertex } from '../../../src/cp-node/fs/is-vertex.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getAllOnCircle } from '../../../src/cp-node/fs/get-all-on-circle.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('isVertex', function() {
    const { cpNode } = getMats1()[0];
    const allOnLoop = getAllOnLoop(cpNode);

    // isVertex(f)(n) === getAllOnCircle(n).some(f)
    const isTerminatingVertex = isVertex(isTerminating);
    for (const n of allOnLoop) {
        expect(isTerminatingVertex(n)).toBe(getAllOnCircle(n).some(isTerminating));
    }
});
