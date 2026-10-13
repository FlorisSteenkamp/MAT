import { expect, test } from '@jest/globals';
import type { CpNode } from '../../../src/cp-node/cp-node.js';
import { getFirstExit } from '../../../src/cp-node/fs/get-first-exit.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getAllOnCircle } from '../../../src/cp-node/fs/get-all-on-circle.js';
import { getProngCount } from '../../../src/cp-node/fs/get-prong-count.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getMats1 } from '../../get-mats1.js';
import { getMatsWithHole } from '../../get-mats-with-hole.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


/** The invariants `getFirstExit` must satisfy for every node of a MAT. */
function checkFirstExits(cpNode: CpNode) {
    for (const cp of getAllOnLoop(cpNode)) {
        const exit = getFirstExit(cp);

        // the expected result: the first non-terminating node strictly after
        // `cp` going round the circle, if any
        const others = getAllOnCircle(cp, true);
        const expected = others.find(c => !isTerminating(c));

        expect(exit).toBe(expected);
        // never the node itself
        expect(exit).not.toBe(cp);
        if (exit !== undefined) {
            expect(getAllOnCircle(cp).includes(exit)).toBe(true);
            expect(isTerminating(exit)).toBe(false);
        }
    }
}


test('getFirstExit', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    // 1-prong at the corner [24,8]: from the terminating node 0 the exit is
    // node 1; from node 1 there is no *other* exit.
    expect(getFirstExit(byId(0))).toBe(byId(1));
    expect(getFirstExit(byId(1))).toBeUndefined();

    // 2-prong {10,11}: each is the exit after the other
    expect(getFirstExit(byId(10))).toBe(byId(11));
    expect(getFirstExit(byId(11))).toBe(byId(10));

    // 3-prong {144,142,143} (all non-terminating): the next one on the circle
    expect(getFirstExit(byId(144))).toBe(byId(142));
    expect(getFirstExit(byId(142))).toBe(byId(143));
    expect(getFirstExit(byId(143))).toBe(byId(144));

    checkFirstExits(cpNode);
});


test('getFirstExit - terminating nodes on 3-prong rings', function() {
    const { cpNode } = getMatsWithHole()[0];
    const all = getAllOnLoop(cpNode);

    // The test is only meaningful if there are terminating nodes on rings of
    // 3 or more (where `next === prevOnCircle` no longer coincides with
    // `isTerminating`, which is what used to trip this function up).
    const terminatingOnBigRings = all.filter(cp =>
        isTerminating(cp) && getProngCount(cp) >= 3
    );
    expect(terminatingOnBigRings.length).toBeGreaterThan(0);

    checkFirstExits(cpNode);
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
