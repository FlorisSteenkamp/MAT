import { expect, test } from '@jest/globals';
import { getInitialDegAngleBetweenMatCurves } from '../../../src/cp-node/fs/get-angle-between-mat-curves.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


test('getInitialDegAngleBetweenMatCurves', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);
    const angle = (id1: number, id2: number) =>
        getInitialDegAngleBetweenMatCurves(byId(id1), byId(id2));

    // The angle is between the *initial* tangents of the MAT edges leaving
    // the two `CpNode`s, folded into [0,90] (it is `|asin(cross)|`).
    const nonTerminating = getAllOnLoop(cpNode).filter(cp => !isTerminating(cp));
    for (const a of nonTerminating) {
        expect(getInitialDegAngleBetweenMatCurves(a, a)).toBeCloseTo(0, 10);
        for (const b of nonTerminating) {
            const ab = getInitialDegAngleBetweenMatCurves(a, b);
            const ba = getInitialDegAngleBetweenMatCurves(b, a);
            expect(ab).toBeCloseTo(ba, 10);
            expect(ab).toBeGreaterThanOrEqual(0);
            expect(ab).toBeLessThanOrEqual(90);
        }
    }

    // The 3-prong with center [81.5,18.5] (ids 147, 145, 146) has contact
    // points [46,18.5], [81.5,54] and [117,18.5]; its edges leave along the
    // bisectors (-1,1), (1,1) and (0,-1).
    expect(angle(147, 145)).toBeCloseTo(90, 8);
    expect(angle(147, 146)).toBeCloseTo(45, 8);  // 135 degrees folded into [0,90]
    expect(angle(145, 146)).toBeCloseTo(45, 8);

    // The medial axis is smooth through a 2-prong: the edge leaving the sharp
    // corner [24,8] (id 1) and the edge continuing from the 2-prong it reaches
    // (id 10) share a tangent.
    expect(angle(1, 10)).toBeCloseTo(0, 6);
    // ...and the two edges leaving a 2-prong (ids 10 and 11) are exactly
    // opposite, which also folds to 0.
    expect(angle(10, 11)).toBeCloseTo(0, 6);
});
