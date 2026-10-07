import { expect, test } from '@jest/globals';
import { getCpNodeOrdering } from '../../../src/cp-node/fs/get-cp-node-ordering.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';


test('getCpNodeOrdering', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    expect(getCpNodeOrdering(byId(147))).toEqual({
        idx: 2, t: 0.2282608695652173, order: 0, order2: 0
    });
    // the two nodes at the same corner point differ in `order` only
    expect(getCpNodeOrdering(byId(0))).toEqual({ idx: 0, t: 1, order: -1, order2: 0 });
    expect(getCpNodeOrdering(byId(1))).toEqual({ idx: 0, t: 1, order:  1, order2: 0 });

    for (const cp of getAllOnLoop(cpNode)) {
        const { curve, t, order, order2 } = cp.pointOnShape;
        expect(getCpNodeOrdering(cp)).toEqual({ idx: curve.idx, t, order, order2 });
    }
});
