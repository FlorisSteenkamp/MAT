import { expect, test } from '@jest/globals';
import { getMatCurvesBetween } from '../../../src/cp-node/fs/get-mat-curves-between.js';
import { getMatCurveToNext } from '../../../src/cp-node/fs/get-mat-curve-to-next.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';
import { expectBeziersConnected, expectPointClose } from '../../helpers/expect-point-close.js';


test('getMatCurvesBetween', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    // nothing between a node and itself
    expect(getMatCurvesBetween(cpNode, cpNode)).toEqual([]);

    // the flattened edges 1 -> 10 -> 144 -> 147 (the edge leaving the end
    // node excluded)
    const pss = getMatCurvesBetween(byId(1), byId(147));
    expect(pss).toEqual([
        ...getMatCurveToNext(byId(1)),
        ...getMatCurveToNext(byId(10)),
        ...getMatCurveToNext(byId(144)),
    ]);
    expectBeziersConnected(pss);
    expectPointClose(pss[0][0], [24, 8]);
    const last = pss[pss.length-1];
    expectPointClose(last[last.length-1], [81.5, 18.5]);

    for (const cp of getAllOnLoop(cpNode)) {
        expect(getMatCurvesBetween(cp, cp.next)).toEqual(getMatCurveToNext(cp));
        expect(getMatCurvesBetween(cp, cp.next.next)).toEqual([
            ...getMatCurveToNext(cp), ...getMatCurveToNext(cp.next)
        ]);
    }

    // all the way round (to the predecessor) covers every edge but one
    const all = getAllOnLoop(cpNode);
    expect(getMatCurvesBetween(cpNode, cpNode.prev)).toEqual(
        all.slice(0, -1).flatMap(getMatCurveToNext)
    );
});
