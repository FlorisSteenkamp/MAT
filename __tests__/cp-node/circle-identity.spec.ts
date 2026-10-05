import { expect, test } from '@jest/globals';
import type { CpNode } from '../../src/cp-node/cp-node.js';
import type { Circle } from '../../src/geometry/circle.js';
import { getPathsFromStr } from 'flo-boolean';
import { findMats } from '../../src/find-mat/find-mats.js';
import { getAllOnCircle } from '../../src/cp-node/fs/get-all-on-circle.js';
import { getAllOnLoop_ByLoop } from '../../src/cp-node/fs/get-all-on-loop-by-loop.js';
import { toStringifyable } from '../../src/cp-node/stringification/to-stringifyable.js';
import { fromStringifyable } from '../../src/cp-node/stringification/from-stringifyable.js';


/**
 * Checks the `PointOnShape.circle` invariant: one `Circle` object per
 * on-circle ring, shared by all of the ring's `CpNode`s and by no other ring.
 */
function checkCircleIdentity(cpStart: CpNode): void {
    const cpNodes = getAllOnLoop_ByLoop(cpStart).flat();

    const ringOfCircle = new Map<Circle, CpNode[]>();
    const seen = new Set<CpNode>();
    for (const cpNode of cpNodes) {
        if (seen.has(cpNode)) { continue; }

        const ring = getAllOnCircle(cpNode);
        const { circle } = cpNode.pointOnShape;
        for (const cp of ring) {
            seen.add(cp);
            // shared by all of the ring's CpNodes
            expect(cp.pointOnShape.circle).toBe(circle);
        }

        // ...and by no other ring
        expect(ringOfCircle.has(circle)).toBe(false);
        ringOfCircle.set(circle, ring);
    }
}


test('one `Circle` object per on-circle ring (incl. hole closers)', function() {
    // a square with a square hole - forces hole-closing 2-prongs
    const loops = getPathsFromStr(
        'M0 0 L100 0 L100 100 L0 100 Z ' +
        'M30 30 L30 70 L70 70 L70 30 Z'
    );
    const { cpNode } = findMats(loops, {})[0];

    // the test is only meaningful if hole closers were actually created
    const cpNodes = getAllOnLoop_ByLoop(cpNode).flat();
    expect(cpNodes.some(cp => cp.holeCloserTwin !== undefined)).toBe(true);

    checkCircleIdentity(cpNode);

    // ...and the invariant survives a (JSON) stringification round trip
    const json = JSON.stringify(toStringifyable(cpNode));
    checkCircleIdentity(fromStringifyable(JSON.parse(json)));
});
