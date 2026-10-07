import { expect, test } from '@jest/globals';
import type { Circle } from '../src/geometry/circle.js';
import { getMats1, cpNodeStringifyable1 } from './get-mats1.js';
import { getAllOnCircle } from '../src/cp-node/fs/get-all-on-circle.js';
import { getAllOnLoop_ByLoop } from '../src/cp-node/fs/get-all-on-loop-by-loop.js';


test('`getMats1` fixture: one `Circle` object per on-circle ring', function() {
    {
        // The stringifyable literal itself (before `fromStringifyable` 
        // normalizes anything) must already share one `Circle` object per
        // on-circle ring and no `Circle` object across rings.
        const { cpNodes } = cpNodeStringifyable1;
        const byId = new Map(cpNodes.map(cp => [cp.id, cp]));

        const seen = new Set<number>();
        const ringOfCircle = new Map<Circle, number[]>();
        for (const cpNode of cpNodes) {
            if (seen.has(cpNode.id)) { continue; }

            // walk the ring via the `nextOnCircle` ids
            const ring: number[] = [];
            let cp = cpNode;
            do {
                ring.push(cp.id);
                seen.add(cp.id);
                cp = byId.get(cp.nextOnCircle as number)!;
            } while (cp !== cpNode);

            const { circle } = cpNode.pointOnShape;
            for (const id of ring) {
                expect(byId.get(id)!.pointOnShape.circle).toBe(circle);
            }
            expect(ringOfCircle.has(circle)).toBe(false);
            ringOfCircle.set(circle, ring);
        }

        expect(ringOfCircle.size).toBe(10);
    }
    {
        // ...and so does the `CpNode` graph built from it
        const { cpNode } = getMats1()[0];
        const cpNodes = getAllOnLoop_ByLoop(cpNode).flat();

        const seen = new Set<typeof cpNode>();
        const circles = new Set<Circle>();
        for (const cp of cpNodes) {
            if (seen.has(cp)) { continue; }

            const { circle } = cp.pointOnShape;
            for (const cp_ of getAllOnCircle(cp)) {
                seen.add(cp_);
                expect(cp_.pointOnShape.circle).toBe(circle);
            }
            expect(circles.has(circle)).toBe(false);
            circles.add(circle);
        }

        expect(circles.size).toBe(10);
    }
});
