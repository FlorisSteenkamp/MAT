import { expect, test } from '@jest/globals';
import { getBranch } from '../../../src/cp-node/fs/get-branch.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getRealProngCount } from '../../../src/cp-node/fs/get-real-prong-count.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


test('getBranch', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);
    const ids = (cps: { id: number }[]) => cps.map(cp => cp.id);

    // The branch from the sharp corner [24,8] via the 2-prong {10,11} to the
    // 3-prong {142,143,144}. `getBranch` walks forward to the first vertex
    // that is not a 2-prong and then returns the branch *back* from there
    // (without the final node), so the result depends on the direction of
    // the given node.
    expect(ids(getBranch(byId(1)))).toEqual([143, 11]);
    expect(ids(getBranch(byId(10)))).toEqual([143, 11]);
    expect(ids(getBranch(byId(11)))).toEqual([1, 10]);
    expect(ids(getBranch(byId(143)))).toEqual([1, 10]);
    // a terminating node first steps to its non-terminating twin
    expect(ids(getBranch(byId(0)))).toEqual([143, 11]);

    // single-edge branches between non-2-prong vertices
    expect(ids(getBranch(byId(144)))).toEqual([146]);  // 3-prong -> 3-prong
    expect(ids(getBranch(byId(147)))).toEqual([3]);    // 3-prong -> leaf

    // Structural invariants for every node in the fixture (none are trivial)
    for (const cp of getAllOnLoop(cpNode)) {
        const branch = getBranch(cp);
        expect(branch.length).toBeGreaterThan(0);

        // consecutive along the boundary
        for (let i=1; i<branch.length; i++) {
            expect(branch[i]).toBe(branch[i-1].next);
        }
        // it starts at a vertex that is not a 2-prong, passes only 2-prongs
        // and the (excluded) final node is again not a 2-prong
        expect(getRealProngCount(branch[0])).not.toBe(2);
        for (const cp of branch.slice(1)) {
            expect(getRealProngCount(cp)).toBe(2);
        }
        const final = branch[branch.length-1].next;
        expect(getRealProngCount(final)).not.toBe(2);
        // every node of the branch represents a real (non-terminating) edge
        for (const cp of branch) { expect(isTerminating(cp)).toBe(false); }
    }

    // The fixture MAT has 5 leaves, 3 3-prongs and 2 2-prongs, so there are
    // 7 distinct branches (up to direction).
    const branchKeys = new Set<string>();
    for (const cp of getAllOnLoop(cpNode)) {
        const branch = getBranch(cp);
        // key by the unordered pair of end vertices (via their circles)
        const a = branch[0].pointOnShape.circle;
        const b = branch[branch.length-1].next.pointOnShape.circle;
        const key = [a, b].map(c => `${c.center[0]},${c.center[1]},${c.radius}`).sort().join('|');
        branchKeys.add(key);
    }
    expect(branchKeys.size).toBe(7);
});
