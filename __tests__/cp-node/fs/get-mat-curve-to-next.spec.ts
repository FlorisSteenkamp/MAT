import { expect, test } from '@jest/globals';
import { getMatCurveToNext, getMatCurveToNext$ } from '../../../src/cp-node/fs/get-mat-curve-to-next.js';
import { getMatCurveBetween } from '../../../src/cp-node/fs/get-mat-curve-between.js';
import { getAllOnLoop } from '../../../src/cp-node/fs/get-all-on-loop.js';
import { getMats1 } from '../../get-mats1.js';


test('getMatCurveToNext', function() {
    const { cpNode } = getMats1()[0];

    for (const cp of getAllOnLoop(cpNode)) {
        const pss = getMatCurveToNext(cp);
        expect(pss).toEqual(getMatCurveBetween(cp, cp.next));

        // the memoized version returns the identical result, once computed
        const pss$ = getMatCurveToNext$(cp);
        expect(pss$).toEqual(pss);
        expect(getMatCurveToNext$(cp)).toBe(pss$);
    }
});
