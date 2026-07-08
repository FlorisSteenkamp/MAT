import { expect, test } from '@jest/globals';
import { getTerminatingOnCircle } from '../../../src/cp-node/fs/get-terminating-on-circle.js';
import { getNonTerminatingOnCircle } from '../../../src/cp-node/fs/get-non-terminating-on-circle.js';
import { getProngCount } from '../../../src/cp-node/fs/get-prong-count.js';
import { isTerminating } from '../../../src/cp-node/fs/is-terminating.js';
import { getMats1 } from '../../get-mats1.js';


test('getTerminatingOnCircle', function() {
    const { cpNode } = getMats1()[0];

    const terminating = getTerminatingOnCircle(cpNode);
    for (const n of terminating) {
        expect(isTerminating(n)).toBe(true);
    }

    // terminating + non-terminating = total prong count
    const nonTerminating = getNonTerminatingOnCircle(cpNode);
    expect(terminating.length + nonTerminating.length).toBe(getProngCount(cpNode));

    // exclThis: cpNode should not be included
    const termExcl = getTerminatingOnCircle(cpNode, true);
    expect(termExcl.includes(cpNode)).toBe(false);
});
