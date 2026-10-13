import { expect, test } from '@jest/globals';
import { reconstructFromMats } from '../../src/reconstruct-from-mat/reconstruct-from-mat.js';
import { getAllOnLoop } from '../../src/cp-node/fs/get-all-on-loop.js';
import { getMatsWithHole } from '../get-mats-with-hole.js';


test('reconstructFromMats - does not modify the given MATs', function() {
    // (the fixture is SAT-processed, so SAT-induced trivial 3-prongs - which
    // `reconstructFromMats` removes before reconstructing - may be present)
    const mats = getMatsWithHole();
    const before = mats.map(mat => ({
        cpNode: mat.cpNode,
        nodes: getAllOnLoop(mat.cpNode),
        links: getAllOnLoop(mat.cpNode).map(cp =>
            [cp.prev, cp.next, cp.prevOnCircle, cp.nextOnCircle]
        )
    }));

    const piecesss = reconstructFromMats(mats);
    expect(piecesss.length).toBe(mats.length);
    for (const piecess of piecesss) {
        for (const pieces of piecess) { expect(pieces.length).toBeGreaterThan(0); }
    }

    // same start node, same nodes, same links
    mats.forEach((mat, i) => {
        expect(mat.cpNode).toBe(before[i].cpNode);
        const nodes = getAllOnLoop(mat.cpNode);
        expect(nodes.length).toBe(before[i].nodes.length);
        expect(nodes.every((cp, k) => cp === before[i].nodes[k])).toBe(true);
        nodes.forEach((cp, k) => {
            const [prev, next, prevOnCircle, nextOnCircle] = before[i].links[k];
            expect(cp.prev).toBe(prev);
            expect(cp.next).toBe(next);
            expect(cp.prevOnCircle).toBe(prevOnCircle);
            expect(cp.nextOnCircle).toBe(nextOnCircle);
        });
    });
});
