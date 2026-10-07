import { expect, test } from '@jest/globals';
import { getHoleClosers } from '../../../src/cp-node/fs/get-hole-closers.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { getMatsWithHole } from '../../get-mats-with-hole.js';


test('getHoleClosers', function() {
    {
        // a single loop has no holes to close
        const { cpNode } = getMats1()[0];
        expect(getHoleClosers(cpNode)).toEqual([]);
    }
    {
        const { cpNode } = getMatsWithHole()[0];
        const holeClosers = getHoleClosers(cpNode);

        // the full set of hole closers on the loop, in loop order (compared
        // by identity - `CpNode`s are circular structures)
        const expected = getAllOnLoop(cpNode).filter(cp => cp.isHoleClosing);
        expect(holeClosers.length).toBe(expected.length);
        expect(holeClosers.every((cp, i) => cp === expected[i])).toBe(true);
        expect(holeClosers.length).toBeGreaterThan(0);

        // hole closers come in twins at the same point - one on each loop
        expect(holeClosers.length % 2).toBe(0);
        for (const cp of holeClosers) {
            const twin = cp.holeCloserTwin!;
            expect(twin).toBeDefined();
            expect(twin.isHoleClosing).toBe(true);
            expect(twin.holeCloserTwin).toBe(cp);
            expect(twin.pointOnShape.p).toEqual(cp.pointOnShape.p);
            expect(holeClosers.includes(twin)).toBe(true);
        }
    }
});
