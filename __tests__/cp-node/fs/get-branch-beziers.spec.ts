import { expect, test } from '@jest/globals';
import { getBranchBeziers } from '../../../src/cp-node/fs/get-branch-beziers.js';
import { getBranch } from '../../../src/cp-node/fs/get-branch.js';
import { getMatCurveToNext } from '../../../src/cp-node/fs/get-mat-curve-to-next.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';
import { cpNodesByIdOn } from '../../helpers/cp-node-by-id.js';
import { expectBeziersConnected, expectPointClose } from '../../helpers/expect-point-close.js';


test('getBranchBeziers', function() {
    const { cpNode } = getMats1()[0];
    const byId = cpNodesByIdOn(cpNode);

    {
        // the branch [143, 11]: from the 3-prong center to the 2-prong center
        // to the sharp corner [24,8]
        const pss = getBranchBeziers(byId(1));
        expect(pss).toEqual([
            ...getMatCurveToNext(byId(143)),
            ...getMatCurveToNext(byId(11))
        ]);
        expectPointClose(pss[0][0], [81.5, -12.641417453935567]);
        const last = pss[pss.length-1];
        expectPointClose(last[last.length-1], [24, 8]);
    }

    // For every node: the (flattened) beziers are the edges of the branch in
    // order, joined end to start, from the first vertex center to the last.
    for (const cp of getAllOnLoop(cpNode)) {
        const branch = getBranch(cp);
        const pss = getBranchBeziers(cp);

        expect(pss).toEqual(branch.flatMap(getMatCurveToNext));
        expect(pss.length).toBeGreaterThanOrEqual(branch.length);
        expectBeziersConnected(pss);
        expectPointClose(pss[0][0], branch[0].pointOnShape.circle.center);
        const last = pss[pss.length-1];
        expectPointClose(
            last[last.length-1],
            branch[branch.length-1].next.pointOnShape.circle.center
        );
        // lines and quadratics only
        for (const ps of pss) { expect([2,3]).toContain(ps.length); }
    }
});
