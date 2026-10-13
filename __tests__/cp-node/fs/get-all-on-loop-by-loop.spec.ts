import { expect, test } from '@jest/globals';
import { getAllOnLoop_ByLoop } from '../../../src/cp-node/fs/get-all-on-loop-by-loop.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { getMatsWithHole } from '../../get-mats-with-hole.js';


test('getAllOnLoop_ByLoop - single loop', function() {
    const { cpNode } = getMats1()[0];
    const all = getAllOnLoop(cpNode);

    for (const cp of all) {
        const cpNodess = getAllOnLoop_ByLoop(cp);
        expect(cpNodess.length).toBe(1);
        expect(cpNodess[0].length).toBe(all.length);
        expect(cpNodess[0][0]).toBe(cp);
        // same nodes, in the same (boundary) order
        const expected = getAllOnLoop(cp);
        expect(cpNodess[0].every((c, i) => c === expected[i])).toBe(true);
    }
});


test('getAllOnLoop_ByLoop - two loops joined by hole closers', function() {
    const { cpNode } = getMatsWithHole()[0];
    // `getAllOnLoop` follows `next` across the hole closers and so visits
    // the nodes of *both* loops
    const all = getAllOnLoop(cpNode);
    const loops = new Set(all.map(cp => cp.pointOnShape.curve.loop));
    expect(loops.size).toBe(2);

    // From *every* start node (in particular from hole closers, which used
    // to drop the other loop) every node must be returned exactly once,
    // grouped by loop.
    for (const cp of all) {
        const cpNodess = getAllOnLoop_ByLoop(cp);

        expect(cpNodess.length).toBe(2);
        const flat = cpNodess.flat();
        expect(flat.length).toBe(all.length);
        expect(new Set(flat).size).toBe(all.length);
        for (const c of all) { expect(flat.includes(c)).toBe(true); }

        // the first group starts at the given node
        expect(cpNodess[0][0]).toBe(cp);

        // each group is on a single loop and the groups are on different ones
        const groupLoops = cpNodess.map(cpNodes => {
            const loop = cpNodes[0].pointOnShape.curve.loop;
            for (const c of cpNodes) { expect(c.pointOnShape.curve.loop).toBe(loop); }
            return loop;
        });
        expect(new Set(groupLoops).size).toBe(2);
    }
});
