import { expect, test } from '@jest/globals';
import type { CpNode } from '../../../src/cp-node/cp-node.js';
import { getFirstExit } from '../../../src/cp-node/fs/get-first-exit.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getAllOnCircle } from '../../../src/cp-node/fs/get-all-on-circle.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


test('getFirstExit', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    // At the 1-prong corner [24,8] node 0 does not exit the circle (its next
    // is simply the other node on the circle) - node 1 does.
    expect(getFirstExit(byId(0))).toBe(byId(1));
    expect(getFirstExit(byId(1))).toBe(byId(1));

    for (const cp of getAllOnLoop(cpNode)) {
        const exit = getFirstExit(cp)!;
        expect(exit).toBeDefined();
        // on the same circle, and it really exits
        expect(getAllOnCircle(cp).includes(exit)).toBe(true);
        expect(exit.next).not.toBe(exit.prevOnCircle);
        // nodes that exit are their own first exit
        if (cp.next !== cp.prevOnCircle) { expect(exit).toBe(cp); }
    }
});


test('getFirstExit - MAT consisting of a single point', function() {
    // Two nodes at the same point forming their own circle and loop (a
    // degenerate MAT); neither exits the circle.
    const a = { id: 0 } as unknown as CpNode;
    const b = { id: 1 } as unknown as CpNode;
    Object.assign(a, { next: b, prev: b, nextOnCircle: b, prevOnCircle: b });
    Object.assign(b, { next: a, prev: a, nextOnCircle: a, prevOnCircle: a });

    expect(getFirstExit(a)).toBeUndefined();
    expect(getFirstExit(b)).toBeUndefined();
});
